# Umstellung der Filedatenbank auf redis
## 1. Redis installieren
Zuerst muss Redis installiert werden.
Dazu sind folgende Eingaben notwendig:

``` bash
sudo apt install lsb-release curl gpg
```
``` bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
```
``` bash
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
```
``` bash
sudo apt update
```
``` bash
sudo apt install redis
```
Ist dies passiert, so kann noch geschaut werden, ob der Redis Server läuft.
``` bash
sudo systemctl status redis-server
```
Ist der Server nicht gestartet, so kann man ihn mit folgendem Befehl starten:
``` bash
sudo systemctl enable redis-server
```
Nun kann man den Container neu starten und nochmals den Status kontrollieren.

## 2. Custom Setup des ioBroker
Nun kann der ioBroker gestoppt werden und das Custom setup gestartet werden.
``` bash
iobroker stop
```
``` bash
iobroker setup custom
```
Folgend wird man durch das Setup geleitet.
Hier ein Auszug von möglichen Antworten auf die Fragen:
<img width="662" height="496" alt="image" src="https://github.com/user-attachments/assets/51091f13-2c7a-42a9-91cf-fdd10d2d3367" />

Bei der Umstellung von file auf redis muss noch bei einem einzelsystem, wie bei einem Master System die migration mit “y” bestätig werden.
Wie oben dargestellt, sollte nun “iobroker status” den Objects und States Typ “redis” zurückmelden.
mit `iobroker start` kann der ioBroker neu gestartet werden.
Ein Neustart des Containers ist sinnvoll, um zu prüfen, dass alles einwandfrei funktioniert (auch nach einem reboot).
