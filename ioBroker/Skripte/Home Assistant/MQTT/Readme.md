# Kommunikation via MQTT ioBroker <=> Home Assistant

Um von ioBroker Daten nach Home Assistant senden, oder auch bidirektional agieren zu können, kann man eine MQTT Verbindung nutzen.
Hier wird die Verwendung des Adapters MQTT-Client beschrieben.
<br/>
<img width="292" height="232" alt="image" src="https://github.com/user-attachments/assets/4a17d4f9-19a8-4b2f-98de-e343bf377838" />
<br/>
<br/>
Die Einbindung erfolgt mittels Discovery topics und payloads. Hierzu muss diese Funktion in Home Assistant aktiviert sein (standard).
<br/>
<img width="571" height="152" alt="image" src="https://github.com/user-attachments/assets/79d12c5d-5b64-45b6-9ab3-d4407b9ad827" />

Um Daten übertragen zu können, geht man im ioBroker auf den States zu dem Zahnrad:
<br/>
<img width="1441" height="37" alt="image" src="https://github.com/user-attachments/assets/ce0de63b-6555-4b84-9767-8c556407378f" />

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
### 1.1.3 Sonstiges
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

# 3 Ausführen der Skripte
## 3.1 Erstes Ausführen
Zuerst muss das Definitions Skript ausgeführt werden.
<br/>
Dies erzeugt die notwendigen definierten States.
<br/>
Im Anschluss, kann einmal manuell das Discovery Skript gestartet werden.
<br/>
Nach dem ersten Durchlauf, sollte in Home Assistant ein Gerät mit dem Namen Discovery und den beiden Entitäten Start und Fortschritt erzeugt worden sein.
<br/>
<img width="145" height="63" alt="image" src="https://github.com/user-attachments/assets/e0c9dc72-778e-4783-9986-7056a8a409b5" />
<br/>
<img width="333" height="388" alt="image" src="https://github.com/user-attachments/assets/ddfc1368-a5c6-4472-afbb-fec767b1dcb7" />
<br/>
Mit den Startbutton, kann ein Synchronieren der in ioBroker konfigurieren States mittels MQTT angestoßen werden.
<br/>
Der Fortschritt gibt an, wie weit das Skript in der Abarbeitung fortgeschritten ist.


# Changelog
## 0.0.25
More options for logging

## 0.0.25
Set Mode, Set und Act Name zu  Climate Entitäten hinzugefügt

## 0.0.24
Climate Topics hinzugefügt

## 0.0.23
Leerzeichen ist in der Topic erlaubt. Unique wird zu "-" gesetzt. Im Namen bleibt das Leerzeichen erhalten.

## 0.0.23
Zeichen vom Typ "_" im Namen gegen " " ausgetauscht

## 0.0.22
Device_class "Weight" hinzugefügt, um einen State vom Typ Gewicht korrekt zu übergeben

## 0.0.21
Korrektur von Einheiten (Bei m^3 => m³)

## 0.0.20
Ein erzeugter Standardstate wird nun 1s nach dem Anlegen mit ACK = true geschrieben.
