# Kommunikation via MQTT ioBroker <=> Home Assistant

Um von ioBroker Daten nach Home Assistant senden, oder auch bidirektional agieren zu können, kann man eine MQTT Verbindung nutzen.
Hier wird die Verwendung des Adapters MQTT-Client beschrieben.

<img width="292" height="232" alt="image" src="https://github.com/user-attachments/assets/4a17d4f9-19a8-4b2f-98de-e343bf377838" />

Um Daten übertragen zu können, geht man im ioBroker auf den States zu dem Zahnrad:
<img width="1443" height="44" alt="image" src="https://github.com/user-attachments/assets/edf81ddb-0cb0-4ecf-b8dd-7885c0272746" />

## 1. Eintragen der Daten in den MQTT-Client
Nun kann man die entsprechenden Einstellungen vornehmen:
<img width="1266" height="496" alt="image" src="https://github.com/user-attachments/assets/b786133e-c0cb-46ce-a34d-24d6afb38e22" />

## 1.1 Topic
Das Topic sollte folgendermaßen aufgebaut sein:
### 1.1.1 Prefix
Beginnen sollte das Topic mit "iobroker/" (Dies ist im Skript konfigurierbar)
### 1.1.2 Gerät
Der Zweite Eintrag ist der Name des Geräts, welches erzeugt werden soll. (Bspw. hier "Talstrasse1a/")
