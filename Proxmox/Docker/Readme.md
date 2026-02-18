# Ausführen des Skripts
## 1. Pakete aktualisieren und curl installieren
```bash
apt update
```
```bash
apt install curl -y
```
## 2. Skript ausgühren
```bash
curl -fsSL https://raw.githubusercontent.com/BenAhrdt/SmartHome/main/Proxmox/Docker/install.sh | bash -s -- NameDeinerAnwendung
```
## 3. Compose file füllen
```bash
nano docker-compose.yml
```
## 4. docker compose starten
```bash
docker compose up -d
```
