
const EnumRegelgruppen = "ControlGroups";
const EnumIsttemperatur = "Temperature.Actual";
const EnumIsttemperaturExtern = "Temperature.Actual.External";
const EnumTemperaturMode2 = "Temperature.Mode2";
const MaxDifferenz = 2 * 60 * 60 * 1000; // 2 Stunden

// Auf einen externen Aufruf reagieren
onMessage('ThermostatActionBeforeUplink',(Data)=>{
    ReadTemperature(Data);
});

function ReadTemperature(Data){
    //log(`Die Temperatur im Raum ${Data.RoomId} wird zugewiesen`);
    const SelectorIsttemperatur = $(`state(${EnumRegelgruppen}=${EnumIsttemperatur})(rooms=${Data.RoomId})`);
    const SelectorIsttemperaturExternal = $(`state(${EnumRegelgruppen}=${EnumIsttemperaturExtern})(rooms=${Data.RoomId})`);

    // Abfragen, ob auch beide Selectoren Ids zurückliefern
    if(SelectorIsttemperatur.length !== 0 && SelectorIsttemperaturExternal.length !== 0){
        const Jetzt = Date.now();
        const Isttemperatur = SelectorIsttemperatur.getState();
        if((Jetzt - Isttemperatur.ts) <= MaxDifferenz){
            SelectorIsttemperaturExternal.setState(Isttemperatur.val);
            //log(`Zugewiesen: ${Isttemperatur.val}°C`);
        }
        else{
            const SelectorMode2 = $(`state(${EnumRegelgruppen}=${EnumTemperaturMode2})(rooms=${Data.RoomId})`);
            if(SelectorMode2.length !== 0){
                SelectorMode2.setState(false);
            }
        }
    }
};
