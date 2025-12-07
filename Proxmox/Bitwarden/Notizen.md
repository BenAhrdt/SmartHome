# Erstellen eines Containers mit Bspw. Ubuntu 22.04
## 1. Updaten des Containers
```bash
apt update && apt upgrade -y && apt autoremove -y
```
## 2. Docker Compose installieren
```bash
apt install docker.io docker-compose -y
```
Prüfen der Docker Version
```bash
docker-compose --version
```
## 3. Bitwarden installieren
```bash
curl -s -L -o bitwarden.sh     "https://func.bitwarden.com/api/dl/?app=self-host&platform=linux"     && chmod +x bitwarden.sh
```
```bash
./bitwarden.sh install
```
```bash
./bitwarden.sh start
```
## 4. Eintragen der Subdomain
Die folgende Datei bearbeiten und subdomain eintragen, welche vorher beim Provider eingerichtet wurde.
Zusätzlich im Ngnix Proxy Manager eintragen.
```bash
nano ./bwdata/env/global.override.env
```
INFO:
globalSettings__baseServiceUri__vault=http://bitw.deine_domain.com
globalSettings__baseServiceUri__cloudRegion=EU
sowie Email Einträge
.....
Speichern, Schliessen

Nun sollte noch ein Rebuild durchgeführt werden.
```bash
./bitwarden.sh rebuild
```
Nun Bitwarden neu starten
```bash
./bitwarden.sh restart
```
## 5. Updates
Für mögliche Updates folgende Befehle verwenden
```bash
apt update &6 apt upgrade -y
```
```bash
./bitwarden.sh updateself
```
```bash
./bitwarden.sh update
```
```bash
reboot
```
