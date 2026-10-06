#pragma once

#include "esphome/components/epaper_spi/epaper_spi_t133a01.h"
#include "esphome/core/log.h"
#include "esp_http_client.h"
#include "esp_task_wdt.h"

namespace esphome {
namespace epaper_raw {
static const char *const TAG = "epaper_raw";
static constexpr size_t RAW_SIZE = 960000;
static constexpr size_t CHUNK_SIZE = 4096;
static constexpr int WIDTH = 1200;
static constexpr int HEIGHT = 1600;

inline Color raw_color(uint8_t value) {
  switch (value & 0x0F) {
    case 0x0F: return Color(0, 0, 0);
    case 0x00: return Color(255, 255, 255);
    case 0x02: return Color(0, 255, 0);
    case 0x06: return Color(255, 0, 0);
    case 0x0B: return Color(255, 255, 0);
    case 0x0D: return Color(0, 0, 255);
    default: return Color(255, 255, 255);
  }
}

inline void feed_watchdog() {
  esp_task_wdt_reset();
  vTaskDelay(pdMS_TO_TICKS(1));
}

inline bool load_raw(epaper_spi::EPaperT133A01 *display, const char *url) {
  ESP_LOGI(TAG, "RAW-Download startet");
  ESP_LOGI(TAG, "URL: %s", url);
  esp_http_client_config_t config = {};
  config.url = url;
  config.timeout_ms = 20000;
  config.buffer_size = CHUNK_SIZE;
  config.buffer_size_tx = 1024;
  esp_http_client_handle_t client = esp_http_client_init(&config);
  if (client == nullptr) { ESP_LOGE(TAG, "esp_http_client_init fehlgeschlagen"); return false; }
  esp_err_t err = esp_http_client_open(client, 0);
  if (err != ESP_OK) { ESP_LOGE(TAG, "HTTP open fehlgeschlagen: %s", esp_err_to_name(err)); esp_http_client_cleanup(client); return false; }
  feed_watchdog();
  int64_t content_length = esp_http_client_fetch_headers(client);
  int status = esp_http_client_get_status_code(client);
  ESP_LOGI(TAG, "HTTP Status: %d", status);
  ESP_LOGI(TAG, "Content-Length: %lld", (long long) content_length);
  if (status != 200) { ESP_LOGE(TAG, "HTTP Status ist nicht 200"); esp_http_client_close(client); esp_http_client_cleanup(client); return false; }
  if (content_length != RAW_SIZE) { ESP_LOGE(TAG, "RAW hat falsche Groesse: %lld", (long long) content_length); ESP_LOGE(TAG, "Erwartet: %u", (unsigned) RAW_SIZE); esp_http_client_close(client); esp_http_client_cleanup(client); return false; }
  uint8_t chunk[CHUNK_SIZE];
  size_t byte_position = 0;
  while (byte_position < RAW_SIZE) {
    size_t remaining = RAW_SIZE - byte_position;
    int wanted = remaining < CHUNK_SIZE ? remaining : CHUNK_SIZE;
    int received = esp_http_client_read(client, reinterpret_cast<char *>(chunk), wanted);
    if (received < 0) { ESP_LOGE(TAG, "HTTP-Lesefehler bei Byte %u", (unsigned) byte_position); esp_http_client_close(client); esp_http_client_cleanup(client); return false; }
    if (received == 0) { ESP_LOGE(TAG, "Download zu frueh beendet: %u / %u", (unsigned) byte_position, (unsigned) RAW_SIZE); esp_http_client_close(client); esp_http_client_cleanup(client); return false; }
    for (int i = 0; i < received; i++) {
      uint8_t packed = chunk[i];
      size_t absolute_byte = byte_position + i;
      size_t first_pixel = absolute_byte * 2;
      int y = first_pixel / WIDTH;
      int x = first_pixel % WIDTH;
      uint8_t left = (packed >> 4) & 0x0F;
      uint8_t right = packed & 0x0F;
      display->draw_pixel_at(x, y, raw_color(left));
      display->draw_pixel_at(x + 1, y, raw_color(right));
      if ((i & 0x01FF) == 0) feed_watchdog();
    }
    byte_position += received;
    if ((byte_position % 65536) < CHUNK_SIZE || byte_position == RAW_SIZE)
      ESP_LOGI(TAG, "RAW: %u / %u Bytes", (unsigned) byte_position, (unsigned) RAW_SIZE);
    feed_watchdog();
  }
  esp_http_client_close(client);
  esp_http_client_cleanup(client);
  feed_watchdog();
  ESP_LOGI(TAG, "RAW komplett geladen: %u Bytes", (unsigned) byte_position);
  ESP_LOGI(TAG, "Framebuffer bereit");
  return byte_position == RAW_SIZE;
}
}  // namespace epaper_raw
}  // namespace esphome
