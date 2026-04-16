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
