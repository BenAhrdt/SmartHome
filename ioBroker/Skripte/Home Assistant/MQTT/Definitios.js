// V 0.0.6


/*
    Definitionen für das Discovery Script MQTT ioBroker <=> Home Assistant
*/
const Definitions = {};


// State, welcher zur Hilfe der zu sendenden Discovery Topics dienst
Definitions.IdEntityGeneration = '0_userdata.0.Produktiv.Home_Assistant.MQTT_Config.Stateconfig';

// Clientinstanz des MQTT Clients
Definitions.Clientinstanz = 'mqtt-client.0';

// Zu verwedendes Starttopic
Definitions.Topicstart = 'iobroker/'

/*
    Hier werden die States eingetragen, die nicht beachtet werden sollen.
    Unter anderem Userdaten Home-Assistant und System States
    !!! Aber auch die Soll und Isttemperaturen, welche bspw. in den Klima Geräten verwendet werden.
*/

// Hier können Anfänge von Ids, oder auch ganze State Ids eingetragen weden, welche nicht verwendet werden dürfen.
Definitions.DisallowedStart = [ 'system',
                                '0_userdata.0.Produktiv.Home_Assistant.Daten',
                                '0_userdata.0.Produktiv.Home_Assistant.MQTT_Config'];
Definitions.StartId = '';
Definitions.SelectorOfObjects = $(`state[id=${Definitions.StartId}*]`).toArray();

// Dieses Array von Topics wird eventuell von den speziellen Geräten gefüllt,
// um die Topics nicht npochmal als normale Entitäten anzulegen.
Definitions.NotAllowedTopics = [];

// Definition StartButton und Fortschritt des Dicovery Scripts
Definitions.IdStartDiscoveryButton = '0_userdata.0.Produktiv.Home_Assistant.MQTT_Config.StartDiscovery';
Definitions.IdProgress = '0_userdata.0.Produktiv.Home_Assistant.MQTT_Config.Fortschritt';
Definitions.IdEnableDiscoveryscript = 'javascript.0.scriptEnabled.common.HomeAssistant.Discovery.Discovery';
/*
            Ende der Hauptdefinitionen
*/

/************************************************
 *      Definition der Climate Entitäten
************************************************/

// Definition der speziellen Geräte (Bspw. CLimate)
Definitions.DeviceDefinitions = [];
Definitions.DeviceDefinitions.push({Type:'climate',
                        Devicename: 'Pool',
                        Entityname: 'Waermepumpe',
                        Mode: 'TemperaturMode',
                        Set: "Temperatursollwert",
                        Act: "Temperaturistwert",
                        MinTemp: 26,
                        MaxTemp: 30,
                        Precision: 1,
                        Modes: ['auto', 'off'],
                        AllowCreationOfEntityWithUsedTopics: true
                        }
                    );

Definitions.DeviceDefinitions.push({Type:'climate',
                        Devicename: 'Heizen ThermostatWellness',
                        Entityname: 'Thermostat',
                        Mode: 'TemperaturMode',
                        Set: "TargetTemperature",
                        Act: "SensorTemperature",
                        MinTemp: 6,
                        MaxTemp: 30,
                        Precision: 0.5,
                        Modes: ['auto', 'heat', 'off'],
                        AllowCreationOfEntityWithUsedTopics: true
                        }
                    );

Definitions.DeviceDefinitions.push({Type:'climate',
                        Devicename: 'Heizen ThermostatKinderzimmerRika',
                        Entityname: 'Thermostat',
                        Mode: 'TemperaturMode',
                        Set: "TargetTemperature",
                        Act: "extSensorTemperature",
                        MinTemp: 6,
                        MaxTemp: 30,
                        Precision: 0.5,
                        Modes: ['auto', 'heat', 'off'],
                        AllowCreationOfEntityWithUsedTopics: true
                        }
                    );

Definitions.DeviceDefinitions.push({Type:'climate',
                        Devicename: 'Heizen ThermostatSpielzimmerRika',
                        Entityname: 'Thermostat',
                        Mode: 'TemperaturMode',
                        Set: "TargetTemperature",
                        Act: "SensorTemperature",
                        MinTemp: 6,
                        MaxTemp: 30,
                        Precision: 0.5,
                        Modes: ['auto', 'heat', 'off'],
                        AllowCreationOfEntityWithUsedTopics: true
                        }
                    );

/**********************************************************************************************************************************************************************
 ***************************************************************** ENDE DER DEFINITIONS *******************************************************************************
 ******************************************************************************************************************************************************************* */


/************************************************
 Start des Discoveryscripts
************************************************/

// Wenn der State noch nicht besteht, dann wird er erzeugt:
await createStateAsync(Definitions.IdStartDiscoveryButton,false,{  "name": "StartDiscovery",
                                                                "desc": "Startet das Discovery Script",
                                                                "role": "button",
                                                                "type": "boolean",
                                                                "read": false,
                                                                "write": true,
                                                                "def": false,
                                                                "custom": {
                                                                [Definitions.Clientinstanz]: {
                                                                    "enabled": true,
                                                                    "publish": true,
                                                                    "pubChangesOnly": false,
                                                                    "pubAsObject": false,
                                                                    "qos": false,
                                                                    "retain": true,
                                                                    "subscribe": true,
                                                                    "subChangesOnly": false,
                                                                    "subAsObject": false,
                                                                    "subQos": false,
                                                                    "setAck": false,
                                                                    "topic": "iobroker/Discovery/Start"
                                                                }
                                                                }
                                                            });


// Wenn der State noch nicht besteht, dann wird er erzeugt:
await createStateAsync(Definitions.IdProgress,false,{   "name": "Fortschritt",
                                                        "role": "state",
                                                        "type": "number",
                                                        "read": true,
                                                        "write": true,
                                                        "def": 0,
                                                        "custom": {
                                                        [Definitions.Clientinstanz]: {
                                                            "enabled": true,
                                                            "publish": true,
                                                            "pubChangesOnly": false,
                                                            "pubAsObject": false,
                                                            "qos": false,
                                                            "retain": true,
                                                            "subscribe": false,
                                                            "subChangesOnly": false,
                                                            "subAsObject": false,
                                                            "subQos": false,
                                                            "setAck": false,
                                                            "topic": "iobroker/Discovery/Fortschritt"
                                                        }
                                                        },
                                                        "desc": "Fortschritt des Scripts in %",
                                                        "unit": "%"
                                                    });

// Stoppen und neustarten des Discovery Scripts
on({id:Definitions.IdStartDiscoveryButton, val:true},(dp)=>{
    setState(Definitions.IdProgress,0,true);
    setState(dp.id,false,true);
    setState(Definitions.IdEnableDiscoveryscript,false);
    setStateDelayed(Definitions.IdEnableDiscoveryscript,true,1000);
});

// Script stoppen, wenn es durchgelaufen ist (100% erreicht wurden)
on({id:Definitions.IdProgress, val:100},(dp)=>{
    setState(Definitions.IdEnableDiscoveryscript,false);
});

/*******************************************
 *   Message zum Abholen der Definitions
 ******************************************/

onMessage('getDevinitions',async (data,callback)=>{
    callback({result:Definitions});//, data: getState(idStartfolderKonfigurationTelegramInstanz).val};
});

