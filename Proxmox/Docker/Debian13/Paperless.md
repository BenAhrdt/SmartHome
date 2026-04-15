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
