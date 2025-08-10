
// Deklaration der enums, auf die Reagiert werden soll
const EnumRegelgruppen = "ControlGroups";
const EnumIsttemperatur = "Temperature.Actual";
const EnumIsttemperaturExtern = "Temperature.Actual.External";
const EnumTemperaturTrigger = "Temperature.Trigger";
const EnumTemperaturMode2 = "Temperature.Mode2";
const Vorzug = 10 * 1000;
const MaxDifferenz = 2 * 60 * 60 * 1000; // 2 Stunden
const MinIntervall = 1 * 60 * 1000;

$(`state(${EnumRegelgruppen}=${EnumTemperaturTrigger})`).on((obj)=>{
    const RoomId = getRoomId(obj.id);
    const Intervall = obj.state.ts - obj.oldState.ts;
    if(Intervall >= MinIntervall){
        ReadTemperatureDelayed(RoomId, Intervall - Vorzug);
    }
});

function ReadTemperatureDelayed(RoomId, Delay){
    //log(`In ${Delay/1000}s wird die Temperatur im Raum ${RoomId} zugewiesen`);
    setTimeout(()=>{
        const SelectorIsttemperatur = $(`state(${EnumRegelgruppen}=${EnumIsttemperatur})(rooms=${RoomId})`);
        const SelectorIsttemperaturExternal = $(`state(${EnumRegelgruppen}=${EnumIsttemperaturExtern})(rooms=${RoomId})`);

        // Abfragen, ob auch beide Selectoren Ids zurückliefern
        if(SelectorIsttemperatur.length !== 0 && SelectorIsttemperaturExternal.length !== 0){
            const Jetzt = Date.now();
            const Isttemperatur = SelectorIsttemperatur.getState();
            if((Jetzt - Isttemperatur.ts) <= MaxDifferenz){
                SelectorIsttemperaturExternal.setState(Isttemperatur.val);
                //log(`Zugewiesen: ${Isttemperatur.val}°C`);
            }
            else{
                const SelectorMode2 = $(`state(${EnumRegelgruppen}=${EnumTemperaturMode2})(rooms=${RoomId})`);
                if(SelectorMode2.length !== 0){
                    SelectorMode2.setState(false);
                }
            }
        }
    },Delay);
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
