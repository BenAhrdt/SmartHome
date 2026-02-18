# Ausführen des Skripts
## 1. Pakete aktualisieren und curl installieren
```bash
apt update
```
```bash
apt install curl -y
```
## 2. Skript ausgühren (Anwendungsname beachten)
```bash
curl -O https://raw.githubusercontent.com/BenAhrdt/SmartHome/main/Proxmox/Docker/install.sh
chmod +x install.sh
./install.sh NameDeinerAnwendung
```
## 3. Compose file füllen
```bash
nano docker-compose.yml
```
## 4. docker compose starten
```bash
docker compose up -d
```
