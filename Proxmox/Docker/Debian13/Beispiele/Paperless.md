# Beispiel zum Erstellen eines Paperless Containers mit NFS Mount und Docker compose
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
Docker-compose-env anlegen
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
Docker starten
```bash
docker compose up -d
```
