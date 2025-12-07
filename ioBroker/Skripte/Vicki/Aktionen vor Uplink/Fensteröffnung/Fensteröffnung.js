const EnumRegelgruppen = "ControlGroups";
const EnumGeraetesollwert = 'Temperature.DeviceTarget'; // Sollwert des Thermostats
const EnumGeraetesollwertRueckmeldung = 'Temperature.DeviceTarget.Back'; // Aktiver Sollwert
const RolleFenster = "sensor.window";
let zwischenspeicher;

// Zwischenspeicher erzeugen
const idZwischenspeicher = '0_userdata.0.Produktiv.Zwischenspeicher.Sollwertregelung';
(async()=>{
    await extendObjectAsync(idZwischenspeicher, {type:'state', common:{type: 'string', role: 'json', name: 'Zwischenspeicher'}});
    // Warten, damit ioBroker das Objekt sauber anlegt
    await new Promise(res => setTimeout(res, 50));
    zwischenspeicher = await getStateAsync(idZwischenspeicher);
    if (zwischenspeicher === null) {
        await setStateAsync(idZwischenspeicher, JSON.stringify({'absenkTemperatur': 6}), true);
    }
    zwischenspeicher = (await getStateAsync(idZwischenspeicher)).val;
    zwischenspeicher = JSON.parse(zwischenspeicher);
})();



// Auf einen externen Aufruf reagieren
onMessage('ThermostatActionBeforeUplink',(Data)=>{
    ReadWindowstate(Data);
});

function ReadWindowstate(Data) {
    const SelectorFenster = $(`state[role=${RolleFenster}](rooms=${Data.RoomId})`);
    const SelectorSollwert = $(`state(${EnumRegelgruppen}=${EnumGeraetesollwert})(rooms=${Data.RoomId})`);
    const SelectorAktiverSollwert = $(`state(${EnumRegelgruppen}=${EnumGeraetesollwertRueckmeldung})(rooms=${Data.RoomId})`);
   
    // Abfragen, ob alle Selectoren Ids zurückliefern
    if(SelectorFenster.length !== 0 && SelectorSollwert.length !== 0 && SelectorAktiverSollwert.length !== 0) {

        const festerzustand = SelectorFenster.getState().val;

        // Fenster geöffnet
        if (festerzustand) {
            if (!zwischenspeicher[Data.RoomId]){
                zwischenspeicher[Data.RoomId] = {};
            }
            // Prüfen, ob der Sollwert undgleich der absenkTemperatur ist.
            if (SelectorAktiverSollwert.getState().val !== zwischenspeicher.absenkTemperatur) {
                zwischenspeicher[Data.RoomId].sollwert = SelectorAktiverSollwert.getState().val;
                SelectorSollwert.setState(zwischenspeicher.absenkTemperatur);
                setState(idZwischenspeicher, JSON.stringify(zwischenspeicher), true);
            }
        }
        // Fenster geschlossen
        else {
            // Prüfen, ob es einen Raum und einen Sollwert im Zwischenspeicher gibt
            if (zwischenspeicher[Data.RoomId] && zwischenspeicher[Data.RoomId].sollwert) {
                // Prüfen, ob der aktive Sollwert gleich der absenkTemperatur ist.
                if (SelectorAktiverSollwert.getState().val !== zwischenspeicher[Data.RoomId].sollwert ||
                    SelectorSollwert.getState().val !== zwischenspeicher[Data.RoomId].sollwert) {
                    SelectorSollwert.setState(zwischenspeicher[Data.RoomId].sollwert);
                }
                // Wenn der Wert übernommen wurde, dann löschen
                else {
                    delete zwischenspeicher[Data.RoomId];
                    setState(idZwischenspeicher, JSON.stringify(zwischenspeicher), true);
                }
            }
        }
    }
};
