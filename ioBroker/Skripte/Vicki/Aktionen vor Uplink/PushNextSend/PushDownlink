
const EnumRegelgruppen = "ControlGroups";
const EnumPushNextSend = "Temperature.PushNextSend"; // Button zum Pushen des NextSend States
const Verzoegerung = 5 * 1000;  // 5S Verzögerung
// Auf einen externen Aufruf reagieren
onMessage('ThermostatActionBeforeUplink',(Data)=>{
    PushNextSendDelayed(Data, Verzoegerung);
});

function PushNextSendDelayed(Data, Delay) {
    const SelectorPusjNextSend = $(`state(${EnumRegelgruppen}=${EnumPushNextSend})(rooms=${Data.RoomId})`);

    // Abfragen, ob auch beide Selectoren Ids zurückliefern
    if(SelectorPusjNextSend.length !== 0) {
        SelectorPusjNextSend.setStateDelayed(true,false,Delay);
    }    
}
