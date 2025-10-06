
// Deklaration der enums, auf die Reagiert werden soll
const EnumRegelgruppen = "ControlGroups";
const EnumTemperaturTrigger = "Temperature.Trigger";
const Vorzug = 30 * 1000;
const MinIntervall = 3 * 60 * 1000;
let LastTimestamp = {};

$(`state(${EnumRegelgruppen}=${EnumTemperaturTrigger})`).on((obj)=>{
    if (!LastTimestamp[obj.id]) {
        LastTimestamp[obj.id] = obj.oldState.ts;
    }
    const RoomId = getRoomId(obj.id);
    const Intervall = obj.state.ts - LastTimestamp[obj.id];
    if(Intervall >= MinIntervall){
        LastTimestamp[obj.id] = obj.state.ts;
        //log(`In ca. ${Math.round((Intervall - Vorzug)/1000)}s werden die Aktionen im Raum ${RoomId} ausgeführt`);
        const delay = Math.max(0, Intervall - Vorzug); // nie negativ
        const Data = {'Intervall': Intervall, 'Vorzug': Vorzug, 'RoomId':RoomId, 'TriggerId': obj.id};
        // setTimeout(fn, delay, ...args) → ...args werden an fn übergeben
        // hier: callMessage(payload) nach Ablauf von "delay"
        setTimeout(callMessage,delay,Data);
    }
});

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

function callMessage(Data){
    messageTo('ThermostatActionBeforeUplink',Data);
}

