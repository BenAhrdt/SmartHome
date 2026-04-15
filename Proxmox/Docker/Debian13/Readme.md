# Docker Installation auf Debian 13 (Trixie)

## 1. System vorbereiten
Paketliste aktualisieren und `curl` installieren:
```bash
apt update
```
```bash
apt install -y curl
```
## 2. Installationsskript ausführen
Das Docker-Installationsskript direkt herunterladen und ausführen:
```bash
curl -fsSL https://raw.githubusercontent.com/BenAhrdt/SmartHome/main/Proxmox/Docker/install.sh | bash
```
## 3. Docker Compose Datei erstellen
Compose-Datei anlegen bzw. bearbeiten:
```bash
nano docker-compose.yml
```
Hier deine gewünschte Konfiguration einfügen (z. B. Paperless, Home Assistant, etc.)

## 4. Container starten
```bash
Docker Compose starten:
```
```bash
docker compose up -d
```
