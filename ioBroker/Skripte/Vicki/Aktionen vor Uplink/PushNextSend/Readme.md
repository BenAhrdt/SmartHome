# Senden des NextSend Inhalts
Um den Inhalt von NextSend.hex vor dem nächsten Uplink zu senden und somit in Chirpstack den Queue zu befüllen,
<br/>
dass der Downlink auch in diesem Zyklus gesendet wird, muss den NextSend-hex Wert gepushed werden.
<br/>
Es müssen folgende Konfigurationen durchgeführt werden.
## 1. Erstellen der Unterkategorien in der Enum "Regelgruppen"

<img width="743" height="420" alt="image" src="https://github.com/user-attachments/assets/b0e0522b-5fb5-4e61-9521-36654e07f6ef" />

### 1.1 Kategrieerklärung
#### 1.1.1 Temperatur.PushNextSend
Diese Kategorie dient dazu, den Wewrt aus NextSend zum LNS zu senden.
