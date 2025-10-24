# 1. Funktionsweise der API von WLED
Die komplette Beschreibung der WLED API findet man hier: https://kno.wled.ge/interfaces/json-api/

# 2. Hostadresse deklarieren und axios requiren
Nun kann man den Kommunikationsstring zum host deklarieren und axio mit require in das Script holen:
<br>
```bash
const host = "http://192.168.2.142/json/state"
const axios = require('axios');
```
# 3. Segmentobjekt anlegen
Ein Objekt mit dem Segmentarray anlegen. (Hier beispielhaft ein Segmentteil)
<br>
```bash
const segmentObject = {
    "seg": [{
    "start": 0,
    "stop": 14}]
};
```
# 4. Post absetzen und Ergebnis loggen
Nun kann man in einer asynchronen Funktion den axios.post absetzen und das Ergebnis loggen.
<br>
```bash
async function setSegments(){
    const response = await axios.post(host,segmentObject);
    log(JSON.stringify(response.data));
}
setSegments();
```
