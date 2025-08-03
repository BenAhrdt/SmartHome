# LXC Container mit Docker anlegen
## 1. Anlegen eines LXC-Containers
Zuerst sollte ein Container mit einem Ubuntu 22.04 Template erezeugt werden.

## 2. Vorbereiten des Containers
Nun kann durch folgende Codezeilen der Container vorbereitet werden.
```bash
apt update && apt upgrade -y && apt autoremove -y
```
```bash
apt install docker.io docker-compose -y
```
```bash
apt install git apparmor
```
## 3. Einfügen des docker-compose.yml files
Nun kann das docker-compose file hinzugefügt werden-
```bash
nano docker-compose.yml
```
## 4. docker compose starten
Durch folgende Codezeile laden wir das docker-compose file hoch und starten es.
```bash
docker-compose up --detach
```
