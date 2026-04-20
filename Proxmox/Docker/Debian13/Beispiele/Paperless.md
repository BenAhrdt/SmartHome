# Beispiel zum Erstellen eines Paperless Containers mit NFS Mount und Docker compose
## 0. lxc-Parameter

lxc-Container unprivilegiert - Nesting aktiven - NFS aktiven
2 CPU-Cores für kleine/ mittlere Setups, 4 CPU-Cores wenn mehrere Konsumenten parallel Dokumente liefern bzw. OCR intensiv genutzt wird
2 GB RAM Minimum / 4 GB RAM ausgewogen für OCR + Web-UI / 8 GB für viele Konsumentenh, pdf-Files > 50 MB oder andere Dienste im lxc
8-16 GB Storage für Paperless + 50-500 GB für Data (1TB für Data bei großen Archiven) (bei nicht gemouteten Daten wichtig)
1-2 GB SWAP-Speicher (4GB für OCR-Spitzen)

## 1. Frisch erstellten Debian 13 LXC updaten
```bash
apt-get update && apt-get upgrade -y apt autoremove -y
```
## 2. Mount anlegen
```bash
apt update && apt install nfs-common -y
```
```bash
mkdir -p /mnt/data
```
```bash
nano /etc/fstab
```
Inhalt der Datei:
```bash
192.168.2.80:/volume1/Proxmox/Paperless  /mnt/data  nfs  defaults,_netdev  0  0
```
Aktivieren und Prüfen
```bash
systemctl daemon-reload
```
```bash
mount /mnt/data
```
Ordner anlegen, sofern nicht da
```bash
mkdir -p /mnt/data/{data,consume,export,media,redisdata}
```
```bash
ls -l /mnt/data
```
Optionaler Schreibtest
```bash
touch /mnt/data/schreibtest.txt && ls -l /mnt/data/schreibtest.txt
```
RCP Dienst dauerhaft aktiviern
```bash
systemctl unmask rpcbind
```
```bash
systemctl enable rpcbind
```
```bash
systemctl start rpcbind
```
Skript zum Warten auf das Netzwerk
```bash
nano /etc/network/if-up.d/fstab-mount
```
Inhalt der Datei:
```bash
#!/bin/sh
# Erzwingt den Mount aus der fstab, sobald das Netz da ist
mount -a
```
Berechtigeung setzen
```bash
chmod +x /etc/network/if-up.d/fstab-mount
```
Gerne reboot und prüfen, ob noch daten  gemouted sind.

## 3. Docker installieren
```bash
apt install docker.io docker-compose -y
```
## 4. Docker-Compose datein anlegen
Docker-compose.yml anlegen
```bash
nano docker-compose.yml
```
Inhalt der Datei
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
Docker-compose-env anlegen</br>
Key erzeugen und für die folgende .env datei nutzen
```bash
openssl rand -hex 32
```
nano docker-compose.env
```
Inhalt der Datei:
```bash
# URL zulassen intern und extern
PAPERLESS_URL=https://paperless.DeineDomain.de
PAPERLESS_CSRF_TRUSTED_ORIGINS=https://paperless.DeineDomain.de,http://192.168.2.225:8000
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

#Polling
PAPERLESS_CONSUMER_POLLING=1
```
Docker starten
```bash
docker compose up -d
```
