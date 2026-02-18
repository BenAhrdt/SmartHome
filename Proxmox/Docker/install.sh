#!/bin/bash
set -e

# Root-Check
if [ "$EUID" -ne 0 ]; then
  echo "Bitte als root ausführen."
  exit 1
fi

# App-Name als Parameter (Standard: myapp)
APP_NAME=${1:-myapp}
INSTALL_DIR="/opt/$APP_NAME"

echo "======================================"
echo "App-Name: $APP_NAME"
echo "Installationsverzeichnis: $INSTALL_DIR"
echo "======================================"

echo "=== System wird aktualisiert ==="
apt update && apt upgrade -y && apt autoremove -y

echo "=== Docker GPG Key hinzufügen ==="
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod 644 /etc/apt/keyrings/docker.asc

echo "=== Docker Repository hinzufügen ==="
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

echo "=== Paketliste neu laden ==="
apt update

echo "=== Docker wird installiert ==="
apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

echo "=== Docker-Version prüfen ==="
docker --version
docker compose version

echo "=== Verzeichnis wird vorbereitet ==="
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "Fertig ✅"
