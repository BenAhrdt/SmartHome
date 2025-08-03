# Update Traccar
## 1. System in der Console updaten
```bash
sudo apt update && sudo apt upgrade -y && apt autoremove -y
```
## 2. Service stoppen und neue Version runterladen
```bash
service traccar stop
```
```bash
wget https://www.traccar.org/download/traccar-linux-64-latest.zip
```
(Darauf achten, unter welchem Namen die Zip-Datei gespeichert wird).
<img width="1003" height="289" alt="image" src="https://github.com/user-attachments/assets/1b973980-5e76-4b99-af84-f7580a6c37aa" />
```bash
unzip traccar-linux-64-latest.zip
```
## 3. Traccar Service vorbereiten, starten und das logging aktivieren (Version prüfen)
```bash
chmod +x traccar.run
```
```bash
./traccar.run
```
```bash
service traccar start
```
```bash
tail -f /opt/traccar/logs/tracker-server.log
```
Das Logging sollte wie folgt aussehen / beginnen
<img width="629" height="102" alt="image" src="https://github.com/user-attachments/assets/452bd5cd-0d13-4c1a-a761-4630ae674895" />
## 4. Updatedatei löschen (optional)
Um die Updatedatei zu löschen:
```bash
rm traccar-linux-64-latest.zip
```
