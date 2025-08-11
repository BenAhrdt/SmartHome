
// V 0.0.22

/*
    In diesem Script, werden alle States, wessen Topic mit "iobroker/" (konfigurierbar) beginnt für Home Assistant sozusagen auto discovert.
    Es muss lediglich im jeweiligen State das Topic eingetragen und ausgewählt werden, ob nur gepublished oder auch subscribed werden soll.
    Das Topic ist folgendemaßen aufzubauen:
    iobroker/Gerätenamen/Frei/Zur/Verfügung/Entitätsname
    Dabei sollte darauf geachtet werden, das keien Umlaute und kein ß verwendet wird.
*/

const Definitions = (await messageToAsync('getDevinitions')).result;


// Wenn der State noch nicht besteht, dann wird er erzeugt:
await createStateAsync(Definitions.IdEntityGeneration,'',{"name": "Discovery","role": "state", "type": "json","read": true,"write": true,"custom": {[Definitions.Clientinstanz]: {"enabled": true,"publish": true,"pubChangesOnly": false,"pubAsObject": false,"qos": false,"retain": true,"subscribe": false,"subChangesOnly": false,"subAsObject": false,"subQos": false,"setAck": false,"topic": ""}}});

// Dieses Array von Topics wird eventuell von den speziellen Geräten gefüllt,
// um die Topics nicht npochmal als normale Entitäten anzulegen.

await setDeviceDefinitions();

async function setDeviceDefinitions(){
    if(Definitions.DeviceDefinitions){
        for(const DeviceDefinition of Definitions.DeviceDefinitions){
            switch(DeviceDefinition.Type){
                case 'climate':
                    await setCLimate(DeviceDefinition);
                break;
            }
            await sleep(100);
        }
    }
}

// Erzeugen einer Climate Entität
async function setCLimate(DeviceDefinition){
  
    // Topic erstellen (Namen bereinigen)
    DeviceDefinition.Devicename = sanitizeForId(DeviceDefinition.Devicename);
    DeviceDefinition.Entityname = sanitizeForId(DeviceDefinition.Entityname);
    const UniquName = DeviceDefinition.Entityname? sanitizeForId(DeviceDefinition.Devicename.toLowerCase()) + '_' + sanitizeForId(DeviceDefinition.Entityname.toLowerCase()): sanitizeForId(DeviceDefinition.Devicename.toLowerCase());
    const Topic = `homeassistant/climate/${UniquName}/config`;

    // DiscoveryJSON aufbereiten
    const DiscoveryJSON = {
        "name": DeviceDefinition.Entityname,
        "unique_id": UniquName,
        "device": {
            "identifiers": [
            sanitizeForId(DeviceDefinition.Devicename.toLowerCase())
            ],
            "name": DeviceDefinition.Devicename
        },
        "mode_state_topic": `${Definitions.Topicstart}${DeviceDefinition.Devicename}/${Definitions.ClimateMode}`,
        "mode_command_topic": `${Definitions.Topicstart}${DeviceDefinition.Devicename}/${Definitions.ClimateMode}`,
        "temperature_state_topic": `${Definitions.Topicstart}${DeviceDefinition.Devicename}/${Definitions.ClimateSollwert}`,
        "temperature_command_topic": `${Definitions.Topicstart}${DeviceDefinition.Devicename}/${Definitions.ClimateSollwert}`,
        "current_temperature_topic": `${Definitions.Topicstart}${DeviceDefinition.Devicename}/${Definitions.ClimateIstwert}`,
        "min_temp": DeviceDefinition.MinTemp,
        "max_temp": DeviceDefinition.MaxTemp,
        "modes": DeviceDefinition.Modes,
        "precision": DeviceDefinition.Precision,
        "temp_step": DeviceDefinition.Precision
        };

    //objekt holen
    const ObjectOfGeneration = await getObjectAsync(Definitions.IdEntityGeneration);
    
    // Zuerst Topic leer schreiben
    ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic = '';
    await setObjectAsync(Definitions.IdEntityGeneration,ObjectOfGeneration);
        
    await setStateAsync(Definitions.IdEntityGeneration,JSON.stringify(DiscoveryJSON),true);
    ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic = Topic;
    await setObjectAsync(Definitions.IdEntityGeneration,ObjectOfGeneration);

    if(!DeviceDefinition.AllowCreationOfEntityWithUsedTopics){
        Definitions.NotAllowedTopics.push(DiscoveryJSON.mode_state_topic);
        Definitions.NotAllowedTopics.push(DiscoveryJSON.temperature_state_topic);
        Definitions.NotAllowedTopics.push(DiscoveryJSON.current_temperature_topic);
    }
    log('Erzeugung einer Climate Entität:' +
        '\nTopic: ' + ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic +
        '\nPayload: ' + JSON.stringify(DiscoveryJSON) +
        '\nModeTopic: ' + DiscoveryJSON.mode_state_topic +
        '\nSolltemperaturTopic: ' + DiscoveryJSON.temperature_state_topic +
        '\nIsttemperaturTopic: ' + DiscoveryJSON.current_temperature_topic);
}


// Nur die Mqtt enabled ids aus dem Slector holen
let ProgressOld = 0;
let Progress = 0;
const ProgressForFindMqttIds = 70;
let ProgressPerId = ProgressForFindMqttIds / Definitions.SelectorOfObjects.length;
Definitions.MqttOjects = [];
for(const id of Definitions.SelectorOfObjects){
    Progress += ProgressPerId;
    if((Progress - ProgressOld) > 1){
        ProgressOld = Progress;
        setState(Definitions.IdProgress,Math.round(Progress),true);
    }
    // Nicht erlaubte Zeichen abfragen
    if (Definitions.DisallowedStart.some(char => id.startsWith(char)) && id !== Definitions.IdStartDiscoveryButton && id !== Definitions.IdProgress) {
        continue;
    }
    const obj = await getObjectAsync(id);
    if(obj && obj.common && obj.common.custom && obj.common.custom[Definitions.Clientinstanz] && obj.common.custom[Definitions.Clientinstanz].enabled){
        // Logging und Abbruch, wenn weder publish, noch subscribe angewählt ist
        if(!obj.common.custom[Definitions.Clientinstanz].publish && !obj.common.custom[Definitions.Clientinstanz].subscribe){
            log('Client wurde aktiviert, aber weder publisch, noch subscribe gewählt:' +
                '\nId: ' + obj._id,
                'warn');
            continue;
        }    
        Definitions.MqttOjects.push(obj);
    };
};

ProgressPerId = (100 - ProgressForFindMqttIds) / Definitions.MqttOjects.length;


await runToObjects();

async function runToObjects(){
    for(const obj of Definitions.MqttOjects){
        Progress += ProgressPerId;
        if((Progress - ProgressOld) > 1){
            ProgressOld = Progress;
            setState(Definitions.IdProgress,Math.round(Progress),true);
        }

        let topic = obj.common.custom[Definitions.Clientinstanz].topic;
        if(topic.indexOf(Definitions.Topicstart) === 0){
            topic = topic.substring(9,topic.length);
            const uniqe = sanitizeForId(topic.toLowerCase(),true);
            const Statetopic = sanitizeForId(topic);
            let DeviceName = 'Dummygerät'
            if(topic.indexOf('/') !== -1){
                DeviceName = topic.substring(0,topic.indexOf('/'));
            }
            DeviceName = sanitizeForId(DeviceName);
            const EntityName = topic.substring(topic.lastIndexOf('/') + 1, topic.length);
            // Generierungsobjekt lesen
            const ObjectOfGeneration = await getObjectAsync(Definitions.IdEntityGeneration);
            
            let Topic = 'homeassistant/';
            const EntityType = getEntityType(obj.common);
            Topic += EntityType + '/';
            Topic += uniqe + '/'
            Topic += 'config';
            ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic = '';
            // Zuerst Topic leer schreiben undanschließend auch state leer schreiben
            await setObjectAsync(Definitions.IdEntityGeneration,ObjectOfGeneration);
            //await sleep(100);
            ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic = sanitizeForId(Topic);

            // Abfrage, ob es sich um ein nicht erlautes Topic handelt
            if(Definitions.NotAllowedTopics.includes(obj.common.custom[Definitions.Clientinstanz].topic)){
                continue;
            }

            const State = {
                "name": EntityName,
                "unique_id": uniqe,
            /*   "step": 0.5,*/
                "device": {
                    "identifiers": [DeviceName.toLowerCase()],
                    "name": DeviceName
                }
            }

            // Weiter Attribute zuweisen
            const MoreAttributes = getHaAttributesForType(obj.common,EntityType);
            for(const Attribute in MoreAttributes){
                State[Attribute] = MoreAttributes[Attribute];
            }

            // Topics zuweisen
            if(!!obj.common?.custom?.[Definitions.Clientinstanz]?.publish){
                State["state_topic"] = Definitions.Topicstart + Statetopic;
            }
            if(!!obj.common?.custom?.[Definitions.Clientinstanz]?.subscribe){
                State["command_topic"] = Definitions.Topicstart + Statetopic;
            }

            // Discovery JSON Schreiben und topic setzen
            await setStateAsync(Definitions.IdEntityGeneration,JSON.stringify(State),true);
            await setObjectAsync(Definitions.IdEntityGeneration,ObjectOfGeneration);
            log('Erzeugung:' +
                '\nTopic: ' + ObjectOfGeneration.common.custom[Definitions.Clientinstanz].topic +
                '\nPayload: ' + JSON.stringify(State) +
                '\nStateTopic: ' + obj.common.custom[Definitions.Clientinstanz].topic +
                '\nId: ' + obj._id);
            if(obj.common.custom[Definitions.Clientinstanz].topic !== sanitizeForId(obj.common.custom[Definitions.Clientinstanz].topic)){
                log('Die originaltopic entspricht nicht den zuelassenen Zeichen und wurde so an HomeAssistant gesendet:\n' +
                    State.state_topic,
                    'warn');
            }
            setStateDelayed(obj._id,getState(obj._id).val,true,1000);
            await sleep(100);
            //await sleep(100);
        }
    }
};
setState(Definitions.IdProgress,100,true);

// Entität type holen
function getEntityType(common) {
    const isWritable = !!common?.custom?.[Definitions.Clientinstanz]?.subscribe;
    const type = common?.type || '';
    const role = (common?.role || '').toLowerCase();

    switch (type) {
        case 'boolean':
            if (role.includes('button') || role.includes('action')) {
                return 'button'; // Trigger-only
            } else if (role.includes('switch')) {
                return isWritable ? 'switch' : 'binary_sensor';
            } else {
                return isWritable ? 'switch' : 'binary_sensor';
            }

        case 'number':
        //    if (role.includes('valve')) return 'valve';
            if (role.includes('value')) return 'sensor';
            return isWritable ? 'number' : 'sensor';

        case 'string':
            return isWritable ? 'text' : 'sensor';

        case 'mixed':
        case 'array':
        case 'object':
        case 'file':
            return 'sensor';

        default:
            return 'sensor';
    }
}

// Device_class und state_class holen
function getHaAttributesForType(common, entityType) {
    const role = (common?.role || '').toLowerCase();
    const unit = common?.unit || '';
    const unitLower = unit.toLowerCase();
    const type = common?.type || '';
    const attributes = {};

    if (entityType === 'sensor' || entityType === 'number') {
        if (role.includes('temperature')) {
            attributes.device_class = 'temperature';
            attributes.unit_of_measurement = unit || '°C';
        } else if (role.includes('humidity')) {
            attributes.device_class = 'humidity';
            attributes.unit_of_measurement = unit || '%';
        } else if (role.includes('illuminance') || role.includes('brightness')) {
            attributes.device_class = 'illuminance';
            attributes.unit_of_measurement = 'lx';//unit || 'lx';
        } else if (role.includes('battery')) {
            attributes.device_class = 'battery';
            attributes.unit_of_measurement = unit || '%';
        } else if (role.includes('power') && !unit.includes('Wh')) { // Sonoff mit value.power.consumtion und kWh ausnehmen
            attributes.device_class = 'power';
            attributes.unit_of_measurement = unit || 'W';
        } else if (unitLower === "w" || unitLower === "kw") {
            attributes.device_class = 'power';
            attributes.unit_of_measurement = unit;
        } else if (unitLower === "v") {
            attributes.device_class = 'voltage';
            attributes.unit_of_measurement = unit;
        } else if (unitLower === "a") {
            attributes.device_class = 'current';
            attributes.unit_of_measurement = unit;
        } else if (role.includes('energy') || (role.includes('power.consumption') && unit.includes('Wh'))) { // Sonoff speziefisch, wegen falscher Rolle
            attributes.device_class = 'energy';
         /*   if(role.includes('consumed') || role.includes('produced')){
                attributes.state_class = 'total';
                attributes.last_reset = "1970-01-01T00:00:00+00:00";
            }
            else{*/
                attributes.state_class = 'total_increasing';
            //}
            attributes.unit_of_measurement = unit || 'Wh';
        } else if (role.includes('weight')) { // Sonoff mit value.power.consumtion und kWh ausnehmen
            attributes.device_class = 'weight';
            attributes.unit_of_measurement = unit || 'kg';
        } else if (unitLower === "g" || unitLower === "kg") {
            attributes.device_class = 'weight';
            attributes.unit_of_measurement = unit;
        } else {
            attributes.unit_of_measurement = unit || '';
        }

        // Korrektur der Unit
        if(attributes.unit_of_measurement === "m^3"){
            attributes.unit_of_measurement = "m³";
        }

        // Min und Max zuweisen
        if(common.min){
            attributes.min = common.min;
        }
        if(common.max){
            attributes.max = common.max;
        }

        // Es muss eine Device Class zugewiesen sein und der State darf kein String sein.
        // String ist kein Measurement
        if(!attributes.state_class && type !== 'string'){
            attributes.state_class = 'measurement';
        }
    }

    if (entityType === 'valve') {
        attributes.unit_of_measurement = unit || '%';
    }

    if(entityType === 'switch'){
        attributes.state_on = 'true';
        attributes.state_off = 'false';
        attributes.payload_on = "true";
        attributes.payload_off = "false";
    }
    if(entityType === 'button'){
        attributes.state_on = 'true';
        attributes.state_off = 'false';
        attributes.payload_on = "true";
        attributes.payload_off = "false";
    }
    if (entityType === 'binary_sensor') {
        if (role.includes('motion')) attributes.device_class = 'motion';
        else if (role.includes('window') || role.includes('door')) attributes.device_class = 'door';
        else if (role.includes('smoke')) attributes.device_class = 'smoke';
        else if (role.includes('presence')) attributes.device_class = 'presence';
        else if (role.includes('moisture') || role.includes('leak')) attributes.device_class = 'moisture';
        attributes.state_on = 'true';
        attributes.state_off = 'false';
        attributes.payload_on = "true";
        attributes.payload_off = "false";
    }

    return attributes;
}

// Nicht erlaube Zeichen bereinigen
function sanitizeForId(str, withoutSlash = false) {
    return str
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/Ä/g, 'Ae')
        .replace(/Ö/g, 'Oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ß/g, 'ss')
        .replace(/ /g, '_')
        .replace(/\//g, withoutSlash ? '_' : '/');
}
