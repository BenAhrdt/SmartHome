
// Deklaration der enums, auf die Reagiert werden soll
const EnumRegelgruppen = "ControlGroups";
const EnumTemperaturTrigger = "Temperature.Trigger";
const Vorzug = 20 * 1000;
const MinIntervall = 1 * 30 * 1000;

$(`state(${EnumRegelgruppen}=${EnumTemperaturTrigger})`).on((obj)=>{
/*    if (!LastTimestamp[obj.id]) {
        LastTimestamp[obj.id] = obj.oldState.ts;
    }*/
    const RoomId = getRoomId(obj.id);
    const Intervall = obj.state.ts - obj.oldState.ts;//LastTimestamp[obj.id];
    if(Intervall >= MinIntervall){
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


on('alias.0.Talstrasse1A.RikasKinderzimmer.Thermostat.time',()=>{
    log('time');
})


on('lorawan.1.bbea74d6-1fc5-4238-af20-d2aecdbb4f8e.devices.70b3d52dd301b3cc.uplink.raw.json',()=>{
    log('json');
})


