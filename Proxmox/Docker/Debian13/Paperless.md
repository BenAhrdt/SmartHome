# 1 Container mit Docker anlegen
Anlagen des Containers mit Docker wie [hier](Readme.md) in Schritt 1 und 2 beschrieben.

# 2. Mount anlegen
```bash
apt-get install nfs-common
```
```bash
nano /etc/fstab
```
Inhalt der Datei:
```bash
192.168.2.80:/volume1/Proxmox/Paperless    /mnt/data nfs auto,rw,sync,hard,intr 0 0
```
```bash
cd /mnt
```
```bash
mkdir data
```
```bash
chmod 777 data
```
```bash
mount -a
```
```bash
cd /mnt/data
```
```bash
ls -la
```
am Besten reboot
# 3. Docker compose env datei anlegen
```bash
nano docker-compose.env
```
Inhalt der Datei:
```bash
# URL zulassen intern und extern
PAPERLESS_URL=https://paperless.ben-schmidt.net
PAPERLESS_CSRF_TRUSTED_ORIGINS=https://paperless.ben-schmidt.net,http://192.168.2.225:8000
PAPERLESS_PROXY_SSL_HEADER=["HTTP_X_FORWARDED_PROTO", "https"]

# Sicherheit
PAPERLESS_SECRET_KEY=Dein generierter Key
PAPERLESS_ADMIN_USER=Dein Username
PAPERLESS_ADMIN_PASSWORD=Dein Passwort

# OCR
PAPERLESS_OCR_LANGUAGE=deu+eng

# User Mapping
USERMAP_UID=1026
USERMAP_GID=100
```
# 4. Docker Compose file anlegen
```bash
nano docker-compose.yml
```
Inhalt der Datei:
```bash
services:
  broker:
    image: docker.io/library/redis:8
    restart: unless-stopped
    volumes:
      - /mnt/data/redisdata:/data
  webserver:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    restart: unless-stopped
    depends_on:
      - broker
    ports:
      - "8000:8000"
    volumes:
      - /mnt/data/data:/usr/src/paperless/data
      - /mnt/data/media:/usr/src/paperless/media
      - /mnt/data/export:/usr/src/paperless/export
      - /mnt/data/consume:/usr/src/paperless/consume
    env_file: docker-compose.env
    environment:
      PAPERLESS_REDIS: redis://broker:6379
      PAPERLESS_DBENGINE: sqlite
volumes:
  data:
  media:
  redisdata:
```
