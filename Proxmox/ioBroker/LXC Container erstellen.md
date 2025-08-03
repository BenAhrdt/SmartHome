# ioBroker LXC erstellen
## 1. Aufsetzen des Containers
<img width="107" height="33" alt="image" src="https://github.com/user-attachments/assets/9abed711-3136-4ba7-a686-c28f64cc2a38" />
<br>
<img width="450" alt="image" src="https://github.com/user-attachments/assets/21b1dfaa-dd22-482a-98b9-0a76bb73f0b0" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/b1b3e48e-c1fe-460b-8c18-8ffcbe091989" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/591079e7-96ea-4d44-ba69-47c02c276215" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/4cf46e54-5e77-4cd6-891d-58eac593c220" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/b5e28b04-c101-42c1-9c4d-0e65686c6fca" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/7eb15ea5-d528-4e9b-8757-322eed390833" />
<img width="450" alt="image" src="https://github.com/user-attachments/assets/0a3b4af7-352e-4bae-ba61-56acc541c939" />

## 2. Erste Schritte im Container
### 2.1 System updaten und upgraden
```bash
apt update && sudo apt upgrade -y && apt autoremove -y
```

### 2.2 Zeitzone einstellen
```bash
timedatectl set-timezone Europe/Berlin
```

### 2.3 eigenen user anlegen und zum superuser machen
```bash
adduser ben
```
(passwort eintragen, wenn gefragt)

```bash
usermod -aG sudo ben
```
```bash
su ben
```

check sudo:
```bash
sudo date
```

### 2.4 Curl installieren
```bash
sudo apt install curl -y
```

### 2.5 IoBroker über das Installations-Script installieren
```bash
curl -sLf https://iobroker.net/install.sh | bash -
```

IoBroker kann jetzt über einen Browser geöffnet werden:
<img width="738" height="274" alt="image" src="https://github.com/user-attachments/assets/0065c347-5df5-4f1d-9738-56c7d037bba6" />
