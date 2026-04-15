# Docker Installation auf Debian 13 (Trixie)

## 📦 1. System vorbereiten
Paketliste aktualisieren und `curl` installieren:
apt update
apt install -y curl

## 🚀 2. Installationsskript ausführen
Das Docker-Installationsskript direkt herunterladen und ausführen:
curl -fsSL https://raw.githubusercontent.com/BenAhrdt/SmartHome/main/Proxmox/Docker/install.sh | bash

## ⚙️ 3. Docker Compose Datei erstellen
Compose-Datei anlegen bzw. bearbeiten:
nano docker-compose.yml
Hier deine gewünschte Konfiguration einfügen (z. B. Paperless, Home Assistant, etc.)

## ▶️ 4. Container starten
Docker Compose starten:
docker compose up -d
