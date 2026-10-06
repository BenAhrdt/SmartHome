# Seeed reTerminal E1004 als Home-Assistant-E-Paper-Bilderrahmen

Dieses Projekt bindet ein **Seeed Studio reTerminal E1004** (ESP32-S3, 1200 × 1600 Pixel, 6-Farb-E-Paper) per **ESPHome** in Home Assistant ein. Home Assistant erzeugt die anzuzeigenden Seiten, konvertiert sie in das native 6-Farb-RAW-Format und stellt `current.raw` per HTTP bereit. Der ESP32 lädt die 960.000 Byte große Datei direkt in den Display-Framebuffer und aktualisiert anschließend das E-Paper.

Die hier dokumentierte Installation kann:

- Bilder aus einem Ordner stündlich von 06:00 bis 22:00 Uhr durchschalten.
- Geburtstage 1–6 Tage vorher um 17:30, 18:30 und 19:30 Uhr anzeigen.
- Am Geburtstag selbst von 06:30 bis 21:30 Uhr stündlich eine Geburtstagsseite anzeigen.
- Ab 19:00 Uhr eine aktive Müll-Erinnerung mit einer oder mehreren Tonnen priorisieren.
- Temperatur, Luftfeuchtigkeit, Batteriespannung und Batteriestand an Home Assistant melden.
- Tasten, LED und Buzzer des E1004 als Home-Assistant-Entitäten bereitstellen.

> **Hinweis:** Entity-IDs, IP-Adressen und Pfade stammen aus der hier aufgebauten Installation. Vor der Übernahme müssen insbesondere Home-Assistant-Adresse und Entity-IDs an die eigene Installation angepasst werden.

## 1. Warum ein eigener RAW-Loader?

Ein vollständiges 1200×1600-Bild über ESPHome `online_image` zu laden und anschließend zu verarbeiten erwies sich auf dem E1004 als nicht stabil genug. Deshalb erfolgt die aufwendige Bildaufbereitung auf Home Assistant.

Der Ablauf ist:

```text
Quellbild / erzeugte Seite
        │
        ▼
convert_epaper.py
        │
        ├── current.png   (6-Farb-Vorschau)
        └── current.raw   (native E1004-Daten, 960000 Byte)
                               │
                               ▼ HTTP
                         ESP32 / ESPHome
                               │
                               ▼
                         Display-Framebuffer
                               │
                               ▼
                         E-Paper Refresh
```

Das Display besitzt 1200 × 1600 = 1.920.000 Pixel. Zwei Pixel werden in einem Byte gespeichert (je 4 Bit), daher beträgt die RAW-Datei exakt **960.000 Byte**.

Unterstützte Farben sind Schwarz, Weiß, Rot, Grün, Blau und Gelb. Die Konvertierung verwendet Floyd-Steinberg-Dithering.

## 2. Voraussetzungen

- Seeed Studio reTerminal E1004
- Home Assistant OS
- ESPHome Add-on
- Advanced SSH & Web Terminal (oder eine andere Möglichkeit, Python auf dem HA-System auszuführen)
- Python 3
- Pillow

Pillow wurde in dieser Installation im Advanced SSH & Web Terminal installiert:

```bash
pip install pillow
```

Prüfen:

```bash
python3 -c "import PIL; print(PIL.__version__)"
```

## 3. Verzeichnisstruktur in Home Assistant

Die Laufzeitdateien liegen unter:

```text
/config/www/epaper/
├── convert_epaper.py
├── naechstes_bild.py
├── render_muell.py
├── render_geburtstag.py
├── current.png
├── current.raw
├── letztes_bild.txt
├── muell_aktuell.png
├── geburtstag_aktuell.png
├── bilder/
│   ├── Bild1.png
│   ├── Bild2.jpg
│   └── ...
├── muell/
│   ├── Bio.png
│   ├── Gelb.png
│   ├── Rest.png
│   └── Blau.png
└── geburtstag/
    ├── Geschenk.png
    └── Torte.png
```

Alles unter `/config/www/` ist über Home Assistant unter `/local/` erreichbar. Aus

```text
/config/www/epaper/current.raw
```

wird beispielsweise:

```text
http://HOME-ASSISTANT:8123/local/epaper/current.raw
```

Die Motivbilder selbst sind in diesem Repository nicht enthalten. Eigene Bilder mit den oben genannten Dateinamen verwenden.

## 4. Python-Skripte installieren

Die Dateien aus [`scripts/`](scripts/) nach `/config/www/epaper/` kopieren:

| Repository | Home Assistant |
|---|---|
| `scripts/convert_epaper.py` | `/config/www/epaper/convert_epaper.py` |
| `scripts/naechstes_bild.py` | `/config/www/epaper/naechstes_bild.py` |
| `scripts/render_muell.py` | `/config/www/epaper/render_muell.py` |
| `scripts/render_geburtstag.py` | `/config/www/epaper/render_geburtstag.py` |

### convert_epaper.py

Bringt ein beliebiges Quellbild auf 1200×1600, quantisiert es auf die sechs Displayfarben und erzeugt:

- eine PNG-Vorschau
- das native 4-Bit-RAW für den E1004

Ein korrekter Lauf endet mit einer RAW-Größe von 960000 Byte.

### naechstes_bild.py

Liest PNG/JPG/JPEG-Dateien aus `/config/www/epaper/bilder`, sortiert sie alphabetisch und merkt sich das zuletzt gewählte Bild in `/config/www/epaper/letztes_bild.txt`.

### render_muell.py

Erzeugt eine Müllseite für bis zu vier Tonnen. Gültige Typen:

```text
bio
gelb
rest
blau
```

Mehrere Tonnen werden kommasepariert übergeben, z. B. `rest,gelb`.

### render_geburtstag.py

Erzeugt die Geburtstagsseite. Bei `tage == 0` wird `Torte.png` verwendet, ansonsten `Geschenk.png`.

## 5. ESPHome

Die Dateien aus [`esphome/`](esphome/) nach `/config/esphome/` kopieren:

```text
/config/esphome/bilderrahmen.yaml
/config/esphome/epaper_raw.h
```

In `bilderrahmen.yaml` muss mindestens diese URL angepasst werden:

```yaml
substitutions:
  image_base_url: "http://DEINE-HA-IP:8123/local/epaper/"
```

Die WLAN- und API-Daten gehören in ESPHome `secrets.yaml`, nicht ins öffentliche GitHub-Repository:

```yaml
wifi_ssid: "..."
wifi_password: "..."
bilderrahmen__encryption_key: "..."
```

Danach ESPHome validieren, kompilieren und auf das E1004 flashen.

### Hardware-Pins dieser Konfiguration

| Funktion | GPIO |
|---|---:|
| SPI CLK | 7 |
| SPI MOSI | 9 |
| I²C SDA | 19 |
| I²C SCL | 20 |
| Batterie Enable | 21 |
| Batterie ADC | 1 |
| LED | 48 |
| Buzzer | 45 |
| Taste rechts | 3 |
| Taste links | 4 |
| Refresh-Taste | 5 |

Beim Booten wartet das Gerät 10 Sekunden und lädt anschließend `current.raw`. Der RAW-Loader liest in 4096-Byte-Blöcken. Während der Verarbeitung wird regelmäßig der Task-Watchdog bedient und dem FreeRTOS-Scheduler Zeit gegeben. Das war nötig, um Watchdog-Resets beim Laden des vollständigen Framebuffers zu verhindern.

## 6. Home-Assistant-Shell-Commands

[`homeassistant/shell_commands.yaml`](homeassistant/shell_commands.yaml) enthält die vier verwendeten Shell-Commands.

Sie können direkt unter `shell_command:` in `configuration.yaml` übernommen oder passend zur eigenen Konfiguration eingebunden werden.

Nach Änderungen an `configuration.yaml` die Konfiguration prüfen und Home Assistant neu starten.

## 7. Home-Assistant-Automationen

Die vier Dateien unter [`automationen/`](automationen/) enthalten die vollständigen Automationen. Sie können über **Einstellungen → Automationen & Szenen** als Automationen angelegt und im YAML-Editor eingefügt werden.

### E-Paper Bild aktualisieren

`epaper_bild_aktualisieren.yaml`

Reagiert auf eine echte Änderung von `text.wohnzimmer_bilderrahmen_bildname`. Zustandswechsel von/zu `unknown` oder `unavailable` werden ignoriert. Dadurch löst das Wiederverbinden des ESP nach einem Neustart keinen unnötigen zweiten Bilddownload aus.

Die Automation konvertiert das ausgewählte Bild nach `current.raw` und betätigt anschließend den ESPHome-Button zum Neuladen.

### Stündlicher Bildwechsel

`stuendlicher_bildwechsel.yaml`

Von **06:00 bis 22:00 Uhr** wird zu jeder vollen Stunde das nächste Bild ausgewählt. Ab 19:00 Uhr wird kein normales Bild mehr gewechselt, solange `binary_sensor.abfall_erinnerung_aktiv` aktiv ist.

### Müllanzeige

`muellanzeige.yaml`

Die Müllseite hat ab **19:00 Uhr** Priorität. Vorher darf die Müll-Erinnerung bereits aktiv sein, verändert die Anzeige aber nicht.

Die verwendeten Sensoren sind:

```text
binary_sensor.abfall_erinnerung_aktiv
sensor.abfall_biotonne
sensor.abfall_gelbe_tonne
sensor.abfall_restabfall
sensor.abfall_altpapier
```

Ein Tageswert von `1` bedeutet in dieser Installation: Abholung morgen. Alle passenden Tonnen werden gemeinsam dargestellt. Wird die Müll-Erinnerung wieder deaktiviert, wird das normale Bild wiederhergestellt.

### Geburtstage

`geburtstag.yaml`

Verwendete Sensoren:

```text
sensor.geburtstag_nachster_tage
sensor.geburtstag_nachster_text
sensor.geburtstag_nachster_geburtsdatum
```

Logik:

- 1–6 Tage vor dem Geburtstag: 17:30, 18:30 und 19:30 Uhr.
- Am Geburtstag (`tage == 0`): jede Stunde xx:30 von 06:30 bis 21:30 Uhr.
- Ab 19:00 Uhr blockiert eine aktive Müll-Erinnerung die Geburtstagsanzeige.

Dadurch ergibt sich beispielsweise:

```text
17:00 normales Bild
17:30 Geburtstag
18:00 normales Bild
18:30 Geburtstag
19:00 Müll (wenn aktiv), sonst normales Bild
19:30 Geburtstag nur wenn Müll nicht aktiv
```

## 8. Prioritäten

Die Anzeigepriorität ist bewusst einfach gehalten:

```text
ab 19:00 aktive Müll-Erinnerung
              ↓ höchste Priorität
          Müllseite

ansonsten geplante Geburtstagsanzeige
              ↓
        Geburtstagsseite

ansonsten
              ↓
         normales Bild
```

Die Tasten sind derzeit nur als Home-Assistant-Binary-Sensoren eingebunden. Es sind absichtlich noch keine Aktionen für Vor/Zurück/Refresh hinterlegt.

## 9. Funktion testen

### Konvertierung testen

In **Entwicklerwerkzeuge → Aktionen**:

```yaml
action: shell_command.epaper_convert
data:
  source: /config/www/epaper/bilder/Bild1.png
```

Danach muss `/config/www/epaper/current.raw` genau 960000 Byte groß sein.

### Display manuell aktualisieren

```yaml
action: button.press
target:
  entity_id: button.wohnzimmer_bilderrahmen_e_paper_bild_neu_laden
```

### Müllseite simulieren

```yaml
action: shell_command.epaper_render_muell
data:
  typ: "rest,gelb"
  datum: "07.10.2026"
```

Danach:

```yaml
action: shell_command.epaper_convert
data:
  source: /config/www/epaper/muell_aktuell.png
```

und schließlich den Reload-Button betätigen.

## 10. An die eigene Installation anpassen

Vor dem Einsatz insbesondere diese Werte prüfen:

- `image_base_url` in `bilderrahmen.yaml`
- WLAN/API-Secrets
- alle Home-Assistant-Entity-IDs
- Abfallsensoren und deren Bedeutung
- Geburtstagssensoren
- Dateinamen der Motive
- Startbild `Pranger.png` in `bilderrahmen.yaml`

Die Automationen verwenden die Entity-IDs der konkreten Installation dieses Projekts und sind daher nicht ohne Anpassung universell einsetzbar.

## 11. Repository-Inhalt

```text
epaper/
├── README.md
├── esphome/
│   ├── bilderrahmen.yaml
│   └── epaper_raw.h
├── scripts/
│   ├── convert_epaper.py
│   ├── naechstes_bild.py
│   ├── render_muell.py
│   └── render_geburtstag.py
├── automationen/
│   ├── epaper_bild_aktualisieren.yaml
│   ├── stuendlicher_bildwechsel.yaml
│   ├── muellanzeige.yaml
│   └── geburtstag.yaml
└── homeassistant/
    └── shell_commands.yaml
```

## Lizenz / Bilder

Die Konfigurations- und Skriptdateien können entsprechend der Lizenz des übergeordneten Repositories verwendet werden. Die für Müll- und Geburtstagsseiten benötigten Grafikdateien sind bewusst nicht Bestandteil dieses Ordners; dafür eigene bzw. passend lizenzierte Grafiken verwenden.
