
// Id Deklaration der States (für spätere Abrufe)
const idOffeneFenster = "0_userdata.0.Produktiv.Fenster.offeneFenster";
const idGeschlosseneFenster = "0_userdata.0.Produktiv.Fenster.geschlosseneFenster";
const idFenster = "0_userdata.0.Produktiv.Fenster.fenster";

// Verschiedene Fenster
const idFensterRika = "alias.0.Talstrasse1A.RikasKinderzimmer.Fenster.ACTUAL";
const idFensterBadezimmer = 'alias.0.Talstrasse1A.Badezimmer.Fenster.ACTUAL';

// Ausgabe skriptweit verfügbar machen
let ausgabe = "";

// Wenn ein Fenster geöffnet wurde, dann wird seine id und der Zeitstempel gespeichert.
// Wird nun ein Fenster geschlossen, wird geschaut ob es entweder eine andere Tür ist, oder
// eine gewisse Zeit zwischen dem Öffnen und dem Schließen vergangen ist. (An sonsten wird
// der Text, dass alle Türen geschlossen sind nicht ausgegeben. (Funktion vorbereitet, aber nicht verwendet)
let timestampLastOpen = {};
let timestampLastOpenSpeak = {};

// Differenzzeiten in Minuten angeben
const minutenInMillisekunden = 60000;
const zeitdifferenzletzteFensteroeffnung = 1 * minutenInMillisekunden; 
const zeitdifferenzLetzteFensteroeffnungsansage = 15 * minutenInMillisekunden;

// Fensterobjekte definieren
let fenster = {};
let offeneFenster = {};
let geschlosseneFenster = {};

//Arrays bei Skriptstart anlegen
$(`state(${enumtypeFunctions}=${enumFenster})[role=sensor.window]`).each((id)=>{
    //objekt und state holen
    let obj = getObject(id);
    let state = getState(id);

    // Objekte zuweisen
    assignObject(obj,state);

    // Zuweisen der Zeitstempel
    let fenstername = obj.common.name;
    timestampLastOpen[fenstername] = Date.now() - zeitdifferenzletzteFensteroeffnung;
    timestampLastOpenSpeak[fenstername] = Date.now() - zeitdifferenzLetzteFensteroeffnungsansage;
});
// Arrays beschreiben
setState(idFenster,JSON.stringify(Object.values(fenster)),true);
setState(idOffeneFenster,JSON.stringify(Object.values(offeneFenster)),true);
setState(idGeschlosseneFenster,JSON.stringify(Object.values(geschlosseneFenster)),true);

// Objekte zuweisen
function assignObject(obj,state){
    // Zuweisen des allgemeinen Türobjekts
    fenster[obj._id] = {name:obj.common.name, zustand: !state.val?"geschlossen": "offen"};

    // Zuweisen des Objekts für die offenen oder geschlossenen Türen
    if(!state.val){
        geschlosseneFenster[obj._id] = fenster[obj._id];
        delete offeneFenster[obj._id];
    }
    else {
        offeneFenster[obj._id] = fenster[obj._id];
        delete geschlosseneFenster[obj._id];
    }    
}

/*********************************************************************************************************
 * *********************************** Ab hier bei Änderungen ********************************************
******************************************************************************************************* */

// Abfrage, ob sich ein Fensterzustand geändert hat
$(`state(${enumtypeFunctions}=${enumFenster})[role=sensor.window]`).on((dp)=>{
    // Objekt holen und zuweisen
    let obj = getObject(dp.id);
    assignObject(obj,dp.state);

    // Verarbeiten der Bewegungsdaten
    handleMovement(obj,dp);


    // Fenster wurde geöffnet => Zeitstempel zuweisen und gegebenfalls Ausgabe durch Alexa
    if(dp.state.val){
        windowOpened(obj,dp.state);
    }
   
    // Arrays beschreiben
    setState(idFenster,JSON.stringify(Object.values(fenster)),true);
    setState(idOffeneFenster,JSON.stringify(Object.values(offeneFenster)),true);
    setState(idGeschlosseneFenster,JSON.stringify(Object.values(geschlosseneFenster)),true);
});

/*********************************************************
 * ********Ausgabe der Fensterbewegungen an Pushover*******
 * ********************************************************/
function handleMovement(obj,dp){
    // Ausgabe von neu beginnen
    ausgabe = "";
    
    //Generierung des Türnamens
    const fenstername = obj.common.name;

    ausgabe = `${fenstername}, wurde `;

    // Zuweien des aktuellen Zustands
    if(!dp.state.val){
        ausgabe += `nach ${BildeStringAusZweiZeitstempel(dp.oldState.lc,dp.state.lc)} geschlossen.`;
    }
    else{
        ausgabe += "geöffnet.";
    }
    // Visulog und Message an Pushover, wenn nicht zu Hause
    messageTo("CAddLogToJson",{log:ausgabe});
    if(SendWithEmergency()){
        Pushover.Emergency(ausgabe,'Fensterbewegung');
    }else{
        Pushover.Debug.Lowest(ausgabe,'Fensterbewegung');
    }
    //logAndSendTelegramMessage.info(ausgabe,usernamePrivat.val,zusatzlog);
}

/***********************************************************
 ***********************************************************
 * ********************************************************/

/***********************************************************
 * ********Ausgabe einer Fensteröffnung durch Alexa*********
 * ********************************************************/

function windowOpened(obj,state){
    // Zeitstempel der Änderung
    const zeitstempelDerAenderung = state.ts;

    //Generierung des Türnamens
    const fenstername = obj.common.name;

    // Zuweien des aktuellen Zeitstempels
    timestampLastOpen[fenstername] = zeitstempelDerAenderung;

    // Ausgabe je nach Fenster vorbereiten
    // Abfrage auf Rikas Fenster
    if(obj._id === idFensterRika || obj._id === idFensterBadezimmer){
        ausgabe = `${fenstername} wurde `; 
        ausgabe += "geöffnet.";

        // Ausgabe der Temperaturen anhand der Fenster und der Alexa-Ausgabegruppen
        // Ausgabe nur durchführen, wenn die Ausgabe das letzte mal vor 15min durchgeführt wurde
        if(((zeitstempelDerAenderung - timestampLastOpenSpeak[fenstername]) > zeitdifferenzLetzteFensteroeffnungsansage) || loglevel >= logtype.Warnung){
            timestampLastOpenSpeak[fenstername] = zeitstempelDerAenderung; 
            // Hinzufügen der Information, wieviel grad gerade sind (für weitere Aktionen, abhängig von der Tür / Ausgabegruppe)
            let aussentemperatur = Math.trunc(getState(idAussentemperaturWetterstation).val * 10)/10;
            ausgabe += ` Draußen sind es aktuell ${aussentemperatur} °C`;

            // Wenn das Fenster in Rikas Kinderzimmer geöffnet wurde, wird eine Nachricht auf der Alexa Infogruppe für die Wäsche wiedergegeben
            if(obj._id === idFensterRika){
                sendAlexaMessageToMultiroomGroup(ausgabe,alexaInfoWaesche);
            }
            else if(obj._id === idFensterBadezimmer){
                // Nur mit aktivem Automatikzustand der Beleuchtung im Flur
                const idAutomatikfreigabeBeleuchtungZustand = '0_userdata.0.Produktiv.Automatikfreigaben.Flur.Beleuchtung.zustand';
                if(getState(idAutomatikfreigabeBeleuchtungZustand)){
                    sendAlexaMessageToMultiroomGroup(ausgabe,alexaInfoWaesche);
                }
            }
        }
    }
}

/***********************************************************
 ***********************************************************
 * ********************************************************/




// Bei Veränderungen eines Fensterzustands die Vis auf die Seite der Fenster schalten
on(idFenster,()=>{
    messageTo("FullyLoadURL",({filter:"Fenster"}));
});



