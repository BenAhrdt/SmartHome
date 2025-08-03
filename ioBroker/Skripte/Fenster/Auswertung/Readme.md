# Fensterauswertung
Mit diesem Skript werden 3 States mit einem JSON-Array der vorhandenen Fenster gefüllt.
## 1. Anlegen der States
In dem Verzeichnis Userdata, sollten die entsprechenden States vom Type JSON angelgt werden.
<img width="400" alt="image" src="https://github.com/user-attachments/assets/56dbeee8-dfe7-447f-ac4e-0f81522ae51e" />

Dies sollte für diese 3 States durchgeführt werden:

<img width="400" alt="image" src="https://github.com/user-attachments/assets/661fe1bf-fc57-434c-997e-ab16512276c0" />

## 2. Kategorie anlegen und zuweisen
In ioBroker, gibt es zwar die Rollen, jedoch kann es sein, das man manche Fenster von dieser Funktion ausschließen möchte.
Zusätzlich bringt eine Kombination aus Kategorie und Rolle die Möglichkeit, dass man bspw. einen kompletten Ordner der entsprechenden
Kategorie zuweist und nur die Rolle des Sensors bspw. beachtet wird.
### 2.1 Kategorie anlegen
In dem Tab Kategorien, wird unter den funktionen die Enum "Fenster" angelegt.

<img width="400" alt="image" src="https://github.com/user-attachments/assets/76f0659a-77a6-483f-bac4-d9afe89c4c59" />

### 2.2 Zuweisen der Datenpunkte
Wie hier zu sehen und auch oben beschrieben, kann direkt der ganze Ordner (in diesem Fall ein Channel) der Kategorie zugewiesen werden.
Dies ermöglicht es, dass für weiter Abfragen bspw. auch der Batteriewert die Kategory Fenster zugewiesen ist.

<img width="1849" height="610" alt="image" src="https://github.com/user-attachments/assets/7438686a-c7f1-4341-985c-926460ac6f84" />


## 3. Skript anpassen
Im Skript müssen diese Zeilen entsprechend den eigenne States angepasst werden:
<pre>
// Id Deklaration der States (für spätere Abrufe)
const idOffeneFenster = "0_userdata.0.Produktiv.Fenster.offeneFenster";
const idGeschlosseneFenster = "0_userdata.0.Produktiv.Fenster.geschlosseneFenster";
const idFenster = "0_userdata.0.Produktiv.Fenster.fenster";

// Verschiedene Fenster
const idFensterRika = "alias.0.Talstrasse1A.RikasKinderzimmer.Fenster.ACTUAL";
const idFensterBadezimmer = 'alias.0.Talstrasse1A.Badezimmer.Fenster.ACTUAL';
</pre>

## 4. Skript nach eigenen wünschen mit verschiedenen Funktionen ausstatten und starten
Nachdem alle Vorbereitungen abgechlossen sind kann das Skript, welches angepasst wurde gestartet werden.
In den einzelnen Funktionen (Bspw. "windowOpened"), können eigene Funktionen realisiert werden.
In meinem Beispiel, werden hier je nach Fenster verschiedene Ausgaben über Alexa gemacht.
(Diese Funktionen sind natürlich durch die eigenen Wünsche und Vorhaben zu ersetzen).
