# Kommunikation via MQTT ioBroker <=> Home Assistant

Um von ioBroker Daten nach Home Assistant senden, oder auch bidirektional agieren zu können, kann man eine MQTT Verbindung nutzen.
Hier wird die Verwendung des Adapters MQTT-Client beschrieben.

<img width="292" height="232" alt="image" src="https://github.com/user-attachments/assets/4a17d4f9-19a8-4b2f-98de-e343bf377838" />

Um Daten übertragen zu können, geht man im ioBroker auf den States zu dem Zahnrad:
<img width="1443" height="44" alt="image" src="https://github.com/user-attachments/assets/edf81ddb-0cb0-4ecf-b8dd-7885c0272746" />

## 1. Eintragen der Daten in den MQTT-Client
Nun kann man die entsprechenden Einstellungen vornehmen:
<img width="1266" height="496" alt="image" src="https://github.com/user-attachments/assets/b786133e-c0cb-46ce-a34d-24d6afb38e22" />
<br/>
<br/>
## 1.1 Topic
Bei den Topic sollte darauf geachtet werden, dass keine Umlaute und Leerzeichen verwendet werden.
<br/>
Das Topic sollte folgendermaßen aufgebaut sein:
### 1.1.1 Prefix
Beginnen sollte das Topic mit "iobroker/" (Dies ist im Skript konfigurierbar)
### 1.1.2 Gerät
Der Zweite Eintrag ist der Name des Geräts, welches erzeugt werden soll. (Bspw. hier "Talstrasse1a/")
### 1.1.3 Softiges
Nachfolgend können beliebig viele Verschachtungen (man sollte es nicht übertreiben) genutzt werden,
um seine Entität strukturiert aufzubauen. (hier "Leistung/")
### 1.1.4 Entitätsname
Als letzten Eintrag im Topic wir der Name der Entität erwarten, welche erzeugt werden soll. (Hier nicht zu sehen "Gesamt")
<br/>
<br/>
## 1.2 Publish
### 1.2.1 Aktiviert
Die Publish Option aktiviert man, wenn Daten von ioBroker zu Home Assistant gesendet werden sollen. (Dies ist in der Regel immer der Fall).
### 1.2.2 Retain
Wird die Retain Option aktiviert, so wird die letzte MQTT Message im Broker gespeichert und Home Assistant, kann sich diese bei einem Neustart abholen.
(Empfohlen [Zumindest für Daten, die nicht regelmäßig gesendet werden])
<br/>
<br/>
## 1.3 Abonnieren
### 1.3.1 Aktiviert
Das Abonnieren bitte aktivieren, wenn die Daten in beide Richtungen schreibbar sein sollen.
(sowohl ioBroker als auch Home Assistant können auf den State schreiben).

## 1.4 Beispiel
Ein Topic sieht also Bspw. so aus: iobroker/Talstrasse1a/Leistung/Gesamt


# 2 Definitions Skript
### 2.1 Grundlegende Definitionen eintragen
Im Definitions Skript, können Grundlegende Infomationen zum System eingetragen werden.
Hier ein Bsp.
<br/>
<br/>
<img width="885" height="610" alt="image" src="https://github.com/user-attachments/assets/ae8d28cf-fc7b-442b-a596-24c0b07682aa" />

Weitergehen, können Entitäten, mit bestimmten Strukturen definiert werden.
Aktuell werden Entitäten mit folgenden Typen unterstützt:
* climate

<img width="517" height="405" alt="image" src="https://github.com/user-attachments/assets/b3194721-b2c9-4bbc-bda4-765cda6663d1" />

Die hier eingestellten Werte wie bspw. Gerätename und Entitätsname müssen natürlich separat im jeweiligen State als Topic eingetragen sein.
Ein Beispiel für die Topic des Temperaturistwerts wäre hier: iobroker/Pool/Temperaturistwert
<br/>
Dier Entitätsname Waermepumpe, bezieht sich hier auf den Name der climate entität.
<br/>
<img width="306" height="63" alt="image" src="https://github.com/user-attachments/assets/6ac72774-1c32-4620-8733-49abc0d91c5f" />

Der letzte Punkt AllowCreationEntityWithUsedTopics gibt an, ob die Topics, welche in den komplexeren Entitäten verwendet wurden,
auch noch separat ezeugt werden sollen. (Hier im Beispiel die Solltemperatuzr, die Isttemperatur und der Mode.


