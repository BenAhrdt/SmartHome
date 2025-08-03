
const IdMindestLueftungszeit = '0_userdata.0.Produktiv.Lueften.MindestLueftungszeit';
const IdGenugGelueftet = '0_userdata.0.Produktiv.Lueften.GenugGelueftet';

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

const Trigger = [];
for(const Fenster in LueftungsFenster){
    Trigger.push(Fenster);
};

on(Trigger,(dp)=>{
    // Fenster wurde geöffnet => Starte die Zählung
    if(dp.state.val){
        setState(LueftungsFenster[dp.id].IdAktivierungZaehlung,true);
    }
    else{
        setState(LueftungsFenster[dp.id].IdAktivierungZaehlung,false);
        // Ausgabe, falls noch gelüftet werden muss#
        const RestlicheMinuten = erzeugeRestlicheMinuten(dp.id);
        if(RestlicheMinuten > 0){
            ausgabeDerLueftungsangabe([{Id:dp.id, RestlicheMinuten: RestlicheMinuten}]); 
        }
    }
});

schedule('{"time":{"start":"9:00","end":"20:00","mode":"minutes","interval":30},"period":{"days":1}}',()=>{
    let NochZuLueftendeFenster = [];
    let FreigabeGenug = true;
    for(const Fenster in LueftungsFenster){
        if(!getState(Fenster).val){  // Fenster nur aufzählen, wenn es nicht göffnet ist
            const RestlicheMinuten = erzeugeRestlicheMinuten(Fenster);
            if(RestlicheMinuten > 0){
                NochZuLueftendeFenster.push({Id:Fenster, RestlicheMinuten: RestlicheMinuten});
            }
        }
        else{
            const RestlicheMinuten = erzeugeRestlicheMinuten(Fenster);
            if(RestlicheMinuten > 0){
                FreigabeGenug = false;
            }
        }
    }
    if(NochZuLueftendeFenster.length !== 0){
        ausgabeDerLueftungsangabe(NochZuLueftendeFenster);
        setState(IdGenugGelueftet,false,true);
    }
    else{
        if(FreigabeGenug && !getState(IdGenugGelueftet).val){
            const Ausgabe = 'Es wurde für heute genug gelüftet.'
            sendAlexaMessageToMultiroomGroup(Ausgabe,alexaInfoWaesche);
            setState(IdGenugGelueftet,true,true);
        }
    }
})

function ausgabeDerLueftungsangabe(NochZuLueftendeFenster){
    let Ausgabe = '';
    for(let i = 0 ; i < NochZuLueftendeFenster.length ; i++){
        if(Ausgabe === ''){
            Ausgabe = `Im ${LueftungsFenster[NochZuLueftendeFenster[i].Id].Name} muss noch ${NochZuLueftendeFenster[i].RestlicheMinuten}`;
        }
        else{
            if(i < NochZuLueftendeFenster.length - 1){
                Ausgabe += `, im ${LueftungsFenster[NochZuLueftendeFenster[i].Id].Name} noch ${NochZuLueftendeFenster[i].RestlicheMinuten}`;
            }
            else{
                    Ausgabe += `und im ${LueftungsFenster[NochZuLueftendeFenster[i].Id].Name} noch ${NochZuLueftendeFenster[i].RestlicheMinuten}`;
            }
        }
    }
    Ausgabe += ' Minuten gelüftet werden.'
    sendAlexaMessageToMultiroomGroup(Ausgabe,alexaInfoWaesche);
}

function erzeugeRestlicheMinuten(IdFenster){
    return Math.ceil(getState(IdMindestLueftungszeit).val - getState(LueftungsFenster[IdFenster].IdMinuten).val);
}
