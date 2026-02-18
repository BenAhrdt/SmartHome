# LXC Container mit Docker anlegen
## 1. Anlegen eines LXC-Containers
Zuerst sollte ein Container mit einem Ubuntu 22.04 Template erezeugt werden.

## 2. Vorbereiten des Containers
Nun kann durch folgende Codezeilen der Container vorbereitet werden.
```bash
apt update && apt upgrade -y && apt autoremove -y
```
## 3. Docker GPG Key hinzufügen
```bash
mkdir -p /etc/apt/keyrings
```
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```
```bash
chmod 644 /etc/apt/keyrings/docker.asc
```
## 4. Docker Repository hinzufügen (Einzeiler, sicher)
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
```
## 5. Paketliste neu laden
```bash
apt update
```
## 6. Docker installieren
```bash
apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```
## 7. Testen
```bash
docker --version
```
```bash
docker compose version
```
