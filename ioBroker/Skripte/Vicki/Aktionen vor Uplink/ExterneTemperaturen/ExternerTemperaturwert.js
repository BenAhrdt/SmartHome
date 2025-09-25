
const EnumRegelgruppen = "ControlGroups";
const EnumIsttemperaturExternIstwert = "Temperature.External.State"; // Istwert des Externen Sensors
const EnumIsttemperaturExternSollwert = "Temperature.External.Set";  // Externser Sollwert (Downlink an Thermostat)
const EnumTemperaturMode2 = "Temperature.Mode2";
const MaxDifferenz = 2 * 60 * 60 * 1000; // 2 Stunden
const extTempStateChanged = {};

const IstTempArray = $(`state(${EnumRegelgruppen}=${EnumIsttemperaturExternIstwert})`).toArray();

on(IstTempArray,(dp)=>{
    const roomId = getRoomId(dp.id);
    extTempStateChanged[roomId] = true;
});

// Auf einen externen Aufruf reagieren
onMessage('ThermostatActionBeforeUplink',(Data)=>{
    ReadTemperature(Data);
});

function ReadTemperature(Data){
    //log(`Die Temperatur im Raum ${Data.RoomId} wird zugewiesen`);
    const SelectorIsttemperatur = $(`state(${EnumRegelgruppen}=${EnumIsttemperaturExternIstwert})(rooms=${Data.RoomId})`);
    const SelectorIsttemperaturExternal = $(`state(${EnumRegelgruppen}=${EnumIsttemperaturExternSollwert})(rooms=${Data.RoomId})`);

    // Abfragen, ob auch beide Selectoren Ids zurückliefern
    if(SelectorIsttemperatur.length !== 0 && SelectorIsttemperaturExternal.length !== 0){
        const Jetzt = Date.now();
        const Isttemperatur = SelectorIsttemperatur.getState();
        if((Jetzt - Isttemperatur.ts) <= MaxDifferenz){
            if (extTempStateChanged[Data.RoomId]) {
                delete extTempStateChanged[Data.RoomId];
                SelectorIsttemperaturExternal.setState(Isttemperatur.val);
                //log(`Zugewiesen: ${Isttemperatur.val}°C`);
            }
        }
        else{
            const SelectorMode2 = $(`state(${EnumRegelgruppen}=${EnumTemperaturMode2})(rooms=${Data.RoomId})`);
            if(SelectorMode2.length !== 0){
                SelectorMode2.setState(false);
            }
        }
    }
};


// Raum finden
function getRoomId(id){
    const myObj = getObject(id,"rooms");
    // Raum vorhanden?
    if(myObj.enumIds[0]){
        return myObj.enumIds[0].substring("enum.rooms.".length,myObj.enumIds[0].length);
    }
    else{
        return null;
    }
};
