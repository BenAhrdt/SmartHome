# Zuweisen einer externen Temeratur zu einem Mclimate Vicki
Um die Isttemperatur eines externen Sensors noch vor dem nächsten Uplink auszulesen und dem Controlstate "ExternalTemperature" zuzuweisen,
<br/>
kann dieses Skirpt verwendet werden.
<br/>
Es müssen folgende Konfigurationen durchgeführt werden.
## 1. Erstellen der Unterkategorien in der Enum "Regelgruppen"
<img width="751" height="729" alt="image" src="https://github.com/user-attachments/assets/f1fee164-8218-4785-a46c-60f03bf1f94e" />
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
