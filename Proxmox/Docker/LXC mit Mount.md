# LXC mit Mount
## 1. Erstellen des LXC Containers
Zuerst muss ein Container erstellt werden. (Das Template sollte vom Type Debian 11 sein).

UNPRIVILEGIERT abwählen.
In den Containeroptionen nach dem erstellen Nesting und NFS anwählen.

## 2. Container starten und erste Befehle eintragen
```bash
apt-get update && apt-get upgrade -y apt autoremove -y
```
```bash
apt install docker.io docker-compose -y
```
## 3. Mount anlegen
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

## 4. Docker Compose file anlegen
```bash
nano docker-compose.yml
```
Inhalt der Datei:
```bash
# docker-compose file for running paperless from the Docker Hub.

# This file contains everything paperless needs to run.

# Paperless supports amd64, arm and arm64 hardware.

#

# All compose files of paperless configure paperless in the following way:

#

# - Paperless is (re)started on system boot, if it was running before shutdown.

# - Docker volumes for storing data are managed by Docker.

# - Folders for importing and exporting files are created in the same directory

#   as this file and mounted to the correct folders inside the container.

# - Paperless listens on port 8000.

#

# SQLite is used as the database. The SQLite file is stored in the data volume.

#

# To install and update paperless with this file, do the following:

#

# - Copy this file as 'docker-compose.yml' and the files 'docker-compose.env'

#   and '.env' into a folder.

# - Run 'docker-compose pull'.

# - Run 'docker-compose run --rm webserver createsuperuser' to create a user.

# - Run 'docker-compose up -d'.

#

# For more extensive installation and update instructions, refer to the

# documentation.

 

version: "3.4"

services:

 broker:

   image: docker.io/library/redis:7

   restart: unless-stopped

   volumes:

     - /mnt/data/redisdata:/data

     

 webserver:

   image: ghcr.io/paperless-ngx/paperless-ngx:latest

   restart: unless-stopped

   depends_on:

     - broker

   ports:

     - "8888:8000"

   healthcheck:

     test: ["CMD", "curl", "-fs", "-S", "--max-time", "2", "http://localhost:8000"]

     interval: 30s

     timeout: 10s

     retries: 5

   volumes:

     - /mnt/data/data:/usr/src/paperless/data

     - /mnt/data/media:/usr/src/paperless/media

     - /mnt/data/export:/usr/src/paperless/export

     - /mnt/data/consume:/usr/src/paperless/consume

   environment:

     PAPERLESS_REDIS: redis://broker:6379

     PAPERLESS_SECRET_KEY: password

     PAPERLESS_ADMIN_USER: user

     PAPERLESS_ADMIN_PASSWORD: password

     PAPERLESS_OCR_LANGUAGE: deu+eng

     PAPERLESS_CONSUMER_DELETE_DUPLICATES: true

     USERMAP_UID: 1026

     USERMAP_GID: 100
```
```bash
docker-compose up --detach
```
