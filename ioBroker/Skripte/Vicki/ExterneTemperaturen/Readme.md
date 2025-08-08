# Zuweisen einer externen Temeratur zu einem Mclimate Vicki
Bei einem Mclimate Vicki ist es möglich eine über einen externen Sensor gemessene Temperatur zuzuweisen und diese antatt der von Vicki selbst gemessenen Temperatur zu nutzen.
<br/>
Dies kann hilfreich, oder auch notwendig sein, wenn das Heizungsthermostat bspw. eingeengt nd / oder in der Abluft des Heizkörpers sitzt und somit die Temperaturmessung verfälscht wird.
<br/>
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
<img width="751" height="876" alt="image" src="https://github.com/user-attachments/assets/0126d5e3-1a85-4c62-97fe-54cb62b66bc1" />

### 1.1 Kategrieerklärung
#### 1.1.1 Temperatur.Istwert
Diese Kategorie dient dazu, den tatsächlichen Istwert des Raumnes zu bestimmen.

#### 1.1.2 Temperatur.Istwert.Extern
Diese Kategorie gibt an, wohin dier Istwert zugewiesen werden soll. (Ziel Bspw. der ExternalTemperatur state vom Vicki).

#### 1.1.3 Temperatur.Mode2
Diese Kategorie dient dazu, dass bei einem längeren nicht Empfangen der Isttemperatur, durch den externen Sensor, das Vicki auf den Mode 1 zurückgesetzt wird. (Der Mode 2 wird also deaktiviert.

#### 1.1.4 Temperatur.Trigger
Diese dieser Kategory befindet sich ein Trigger, der mit jedem uplink des Vickis gesetzt wird. (Verändert)
Hier wurde der Time state genommen, da dieser sich definitiv immer verändert. (Dieser State wird zur automatischen Intervallberechnung genutzt).
Es wird also der die aktuelle Temperatur nicht so oft an das Vicki übergeben, wie sie sich verändert, sondern nur mit einer gewissen Vorlaufzeit vor dem nächsten Uplink.
Diese ist also ausschlaggeben für die Einlesung der Isttemperatur und nicht der sich ändernde Wert selbst.
