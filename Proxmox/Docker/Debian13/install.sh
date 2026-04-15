#!/bin/bash
set -e

# Root-Check
if [ "$EUID" -ne 0 ]; then
  echo "Bitte als root ausführen."
  exit 1
fi

echo "=== System wird aktualisiert ==="
apt update && apt upgrade -y && apt autoremove -y

echo "=== Benötigte Pakete installieren ==="
apt install -y curl ca-certificates gnupg

echo "=== Docker GPG Key hinzufügen ==="
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod 644 /etc/apt/keyrings/docker.asc

echo "=== Docker Repository hinzufügen ==="
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list

echo "=== Paketliste neu laden ==="
apt update

echo "=== Docker wird installiert ==="
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== Docker-Version prüfen ==="
docker --version
docker compose version

echo "Fertig ✅"
