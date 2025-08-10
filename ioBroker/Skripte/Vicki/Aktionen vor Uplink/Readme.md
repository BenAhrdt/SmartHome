# Durchführen einer bestimmten Aktion vor dem nächsten Uplink
Bei einem Mclimate Vicki, kann es durchaus Aktionen geben, die man noch vor dem nächsten Uplink und einem damit verbunden Downlink durchführen möchte.
<br/>
Ein Beispiel dafür, wäre bspw. den aktuellen Temperaturwert, welche über einen externen Sensor gemessen wird zuzuweisen.
<br/>
Hierzu dient das Trigger Script, welches folgende Konfiguration benötigt.
<br/>
## 1. Erstellen einer eigenen Enum (Kategorie)
Um eine Zuweisung der entsprechenden Werte zu machen, wird im Skript nach verschiedenen Enums und dem Raum geschaut, wo sich das Thermostat befindet.
<br/>
Es wurde zuerst eine eigene Enum "Regelgruppen" angelegt.
<img width="579" height="346" alt="image" src="https://github.com/user-attachments/assets/ac8f8313-8954-4b2b-82c3-41865b4a7990" />
<br/>
<br/>
Nun werden einzelne Unterkategorien angelegt.
<br/>
<br/>
<img width="751" height="425" alt="image" src="https://github.com/user-attachments/assets/fadd03b6-687e-4491-ba5b-d224a0381c36" />

### 1.1 Kategrieerklärung
#### 1.1.1 Temperatur.Istwert
Diese Kategorie dient dazu, den tatsächlichen Istwert des Raumnes zu bestimmen.

#### 1.1.2 Temperatur.Istwert.Extern
Diese Kategorie gibt an, wohin dier Istwert zugewiesen werden soll. (Ziel Bspw. der ExternalTemperatur state vom Vicki).

#### 1.1.3 Temperatur.Mode2
Diese Kategorie dient dazu, dass bei einem längeren nicht Empfangen der Isttemperatur, durch den externen Sensor, das Vicki auf den Mode 1 zurückgesetzt wird. (Der Mode 2 wird also deaktiviert).

#### 1.1.4 Temperatur.Trigger
In diese Kategorie legen Sie bitte einen Wert, der mit jedem uplink des Vicki einen neuen Wert annimmt.
<br/>
Dies ist notwendig, da aus zwei aufeinanderfolgenden Werten das Sendeintervall der Vickis errechnet wird.
<br/>
Hier wurde der State Time genommen, welcher sich im remaining Ordner des LoraWAN Adapters befindet.
<br/>
Es wird also die aktuelle Temperatur nicht so oft an das Vicki übergeben, wie sich edr State der Isttemperatru verändert, sondern nur mit einer gewissen Vorlaufzeit vor dem nächsten Uplink.
<br/>
Diese ist also ausschlaggeben für die Einlesung der Isttemperatur und nicht der sich ändernde Wert selbst.
