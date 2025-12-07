# Zuweisen einer Minimaltemperatur einem Mclimate Vicki bei offenem Fenster
Um die Solltemperatur eines Vickis bei offenem Fenster herunterzufahren, muss die Öggnung des Fensters erfasst werden.
Hierzu wird ein Boolschaes Signal benutzt.
Um dies pro Raum abfragen zu können, wird die Rolle "sensor.window" in Kombination zu dem zugehörigen Raum (aus dem der Trigger kam) abgefragt.
<br/>
Es müssen folgende Konfigurationen durchgeführt werden.
## 1. Erstellen der Unterkategorien in der Enum "Regelgruppen"
<img width="1338" height="1300" alt="image" src="https://github.com/user-attachments/assets/86c40228-ff84-4b1c-a7b0-0f670a6a479e" />

### 1.1 Kategrieerklärung
#### 1.1.1 Temperatur.Gerätesollwert
Diese Kategorie dient dazu, den Sollwert ans Gerät zu senden.

#### 1.1.2 Temperatur.Gerätesollwert.Rückmeldung
Diese Kategorie gibt an, welcher Sollwert im Gerät aktiv ist.
Diese Abfrage dient dazu, falls während des offenen Fensters ein Heizplan den SOllwert verstellt,
wird dieser als neuer Sollwert übernommen und der Sollwert auf die minimale Temperatur gesetzt.
