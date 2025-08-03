# Plex Container anlegen
## 1. Erstellen des LXC Containers
Zuerst muss ein Container erstellt werden. (Template Ubuntu 24.04 verwendet).

UNPRIVILEGIERT abwählen.
In den Containeroptionen nach dem erstellen Nesting und NFS anwählen.

## 2. Container starten und erste Befehle eintragen
```bash
apt-get update && apt-get upgrade -y apt autoremove -y
```

## 3. Mount anlegen
```bash
apt-get install nfs-common
```
```bash
nano /etc/fstab
```
```bash
192.168.2.80:/volume1/video    /mnt/data nfs auto,rw,sync,hard,intr 0 0
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

## 4. System aktualisieren und benötigte Pakete installieren
```bash
sudo apt update
```
```bash
sudo apt install curl gpg ca-certificates apt-transport-https software-properties-common -y
```
## 5: Plex GPG-Schlüssel importieren
```bash
curl -fsSL https://downloads.plex.tv/plex-keys/PlexSign.key | gpg --dearmor | sudo tee /usr/share/keyrings/plex.gpg > /dev/null
```
## 6. Plex APT-Repository hinzufügen
```bash
echo "deb [signed-by=/usr/share/keyrings/plex.gpg] https://downloads.plex.tv/repo/deb public main" | sudo tee /etc/apt/sources.list.d/plexmediaserver.list
```
## 7. Plex Media Server installieren
```bash
sudo apt update
```
```bash
sudo apt install plexmediaserver -y
```
## 8. Dienststatus überprüfen und starten
```bash
sudo systemctl status plexmediaserver
```
```bash
sudo systemctl enable --now plexmediaserver
```
## 9. Plex Web-Oberfläche öffnen
http://IP-Adresse:32400/web
