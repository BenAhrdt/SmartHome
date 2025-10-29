# 1. Anlegen eines lxc containers mit docker-compose
Wie hier vorhehen: [LXC Container mit Docker anlegen](https://github.com/BenAhrdt/SmartHome/blob/main/Proxmox/Docker/LXC%20Container%20mit%20Docker%20anlegen.md)

# 2. docker compose datei einfügen

```bash
version: '3.9'

services:
  db:
    image: mariadb:10.6
    container_name: nextcloud_db
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: DeinPasswort
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: DeinUser
      MYSQL_PASSWORD: DeinPasswort

  redis:
    image: redis:latest
    container_name: nextcloud_redis
    restart: unless-stopped
    volumes:
      - redis_data:/data

  app:
    image: nextcloud:latest
    container_name: nextcloud_app
    restart: unless-stopped
    ports:
      - "80:80"  # Achte darauf, dass Port 80 auf dem Host nicht belegt ist
    volumes:
      - nextcloud_data:/var/www/html
    environment:
      MYSQL_HOST: db
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: DeinUser
      MYSQL_PASSWORD: DeinPasswort
      REDIS_HOST: redis

volumes:
  db_data:
  redis_data:
  nextcloud_data:
```

# 3. Von extern verfügbar machen:
Um Nextcloud von extern ansprechen zu können, muss es im Niginx (oder anderen Proximanager) anktivert sein und dnach sollten folgende Schritte im container ausgeführt werden:

```bash
# HTTPS für alle Links/Redirects
docker exec -it -u www-data nextcloud_app php occ config:system:set overwriteprotocol --value=https

# Basis-URL
docker exec -it -u www-data nextcloud_app php occ config:system:set overwrite.cli.url --value="https://Deine.Subdomain.xy"

# Trusted domain (Hinweis unten beachten)
docker exec -it -u www-data nextcloud_app php occ config:system:set trusted_domains 0 --value="Deine.Subdomain.xy"

# Kontrolle
docker exec -it -u www-data nextcloud_app php occ config:system:get overwriteprotocol
docker exec -it -u www-data nextcloud_app php occ config:system:get overwrite.cli.url
docker exec -it -u www-data nextcloud_app php occ config:system:get trusted_domains

# Danach neu starten
docker restart nextcloud_app

```
