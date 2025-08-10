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
### 1.1 Kategorieerklärung
#### 1.1.4 Temperatur.Trigger
In diese Kategorie legen Sie bitte einen Wert, der mit jedem uplink des Vicki einen neuen Wert annimmt.
<br/>
Dies ist notwendig, da aus zwei aufeinanderfolgenden Werten das Sendeintervall der Vickis errechnet wird.
<br/>
Hier wurde der State Time genommen, welcher sich im remaining Ordner des LoraWAN Adapters befindet.
<br/>
## 2. Skripterklärung
### 2.1 Message versand aus dem Trigger Skript
Aus dem Triggerskript, wird eine Message mit dem zuständigen Raum gesendet.
<br/>
Das aktuelle Format der Daten in der Message siet aktuell so aus:
<br/>
<img width="496" height="36" alt="image" src="https://github.com/user-attachments/assets/defca01f-c6c7-49ea-95f6-680e72aa3b5d" />
<br/>
Die Message lautet: "ThermostatActionBeforeUplink" und sieht wie folgt aus:
<br/>
<img width="737" height="45" alt="image" src="https://github.com/user-attachments/assets/6945c592-99d1-4a0b-8534-0d4c7216e405" />
<br/>
<br/>
In den auf die Message zu reagierenden Skripten, kann wie folgt auf diese Message reagiert werden:
<br/>
<img width="786" height="154" alt="image" src="https://github.com/user-attachments/assets/c8640b4e-73d2-4ab2-9e53-0007a3ad070a" />


