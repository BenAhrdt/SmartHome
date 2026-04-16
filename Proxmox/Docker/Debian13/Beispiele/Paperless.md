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
192.168.2.80:/volume1/Proxmox/Paperless2  /mnt/data  nfs  defaults,_netdev,x-systemd.automount,x-systemd.mount-timeout=30  0  0
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
```bash

```
```bash

```
```bash

```
