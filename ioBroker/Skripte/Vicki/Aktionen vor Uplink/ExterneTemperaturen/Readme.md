# Zuweisen einer externen Temeratur zu einem Mclimate Vicki
Um die Isttemperatur eines externen Sensors noch vor dem nächsten Uplink auszulesen und dem Controlstate "ExternalTemperature" zuzuweisen,
<br/>
kann dieses Skirpt verwendet werden.
<br/>
Es müssen folgende Konfigurationen durchgeführt werden.
## 1. Erstellen der Unterkategorien in der Enum "Regelgruppen"
<img width="743" height="872" alt="image" src="https://github.com/user-attachments/assets/3523bcdc-26e8-4da1-aece-0dfeb8ce85cd" />

### 1.1 Kategrieerklärung
#### 1.1.1 Temperatur.Istwert
Diese Kategorie dient dazu, den tatsächlichen Istwert des Raumnes zu bestimmen.

#### 1.1.2 Temperatur.Istwert.Extern
Diese Kategorie gibt an, wohin dier Istwert zugewiesen werden soll. (Ziel Bspw. der ExternalTemperatur state vom Vicki).

#### 1.1.3 Temperatur.Mode2
Diese Kategorie dient dazu, dass bei einem längeren nicht Empfangen der Isttemperatur, durch den externen Sensor, das Vicki auf den Mode 1 zurückgesetzt wird. (Der Mode 2 wird also deaktiviert).
