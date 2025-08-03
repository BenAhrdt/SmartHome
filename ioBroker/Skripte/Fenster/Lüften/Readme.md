# Auswertung & Ausgabe der zu lüften Fenster
Wenn man gewisse Fenster im Haus / der Wohnung hat, welche Täglich gelüstet werden sollten,
so kann man sich durch dieses Skript und hier bspw. Alex erinnern lassen.
Dieses Skript arbeitet zusammen mit dem Adapter "operating-hours".
Dieser muss logischerweise installiert und entsprechend konfiguriert sein.

Das Skript erwartet 2 States in den Userdaten, welche zuvor angelegt werden sollten.
<img width="1947" height="199" alt="image" src="https://github.com/user-attachments/assets/c28099ec-b609-4294-a51a-0bdc255020ec" />

Anschließend können diese State (Deren Id) im Skript zugewiesen werden:
<pre>
const IdMindestLueftungszeit = '0_userdata.0.Produktiv.Lueften.MindestLueftungszeit';
const IdGenugGelueftet = '0_userdata.0.Produktiv.Lueften.GenugGelueftet';
</pre>

Die zu lüftenden Fenster, können über das Skript in dem Array angepasst werden:

<pre>
const LueftungsFenster = {
    'alias.0.Talstrasse1A.Wohnzimmer.Balkonfenster.ACTUAL': 
                {
                    Name: 'Wohnzimmer',
                    IdAktivierungZaehlung: 'operating-hours.0.LueftenWohnzimmer.administrative.enableCounting',
                    IdMinuten: 'operating-hours.0.LueftenWohnzimmer.operatingHours.minutes'
                },
    'alias.0.Talstrasse1A.Schlafzimmer.Fenster.ACTUAL': 
                {
                    Name: 'Schlafzimmer',
                    IdAktivierungZaehlung: 'operating-hours.0.LueftenSchlafzimmer.administrative.enableCounting',
                    IdMinuten: 'operating-hours.0.LueftenSchlafzimmer.operatingHours.minutes'
                }
                        };
</pre>
