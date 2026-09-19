// ============================================================
// KONFIGURATION
// ============================================================

const monitoringStateId = 'device-monitoring.0.info.message';


// ============================================================
// MONITORING-STATE ÜBERWACHEN
// ============================================================

on(
    {
        id: monitoringStateId,
        change: 'ne'
    },

    (obj) => {

        try {

            // ----------------------------------------------------
            // State prüfen
            // ----------------------------------------------------

            if (!obj || !obj.state) {

                log(
                    'Monitoring-State enthält keinen gültigen State.',
                    'warn'
                );

                return;
            }


            const rawValue = obj.state.val;


            if (
                rawValue === null ||
                rawValue === undefined ||
                rawValue === ''
            ) {

                log(
                    'Monitoring-State enthält keinen Wert.',
                    'warn'
                );

                return;
            }


            // ----------------------------------------------------
            // JSON einlesen
            // ----------------------------------------------------

            let data;


            if (typeof rawValue === 'string') {

                data = JSON.parse(rawValue);

            } else {

                data = rawValue;
            }


            // ----------------------------------------------------
            // Grundstruktur prüfen
            // ----------------------------------------------------

            if (
                !data ||
                typeof data !== 'object'
            ) {

                log(
                    'Monitoring-State enthält kein gültiges Objekt.',
                    'warn'
                );

                return;
            }


            // ----------------------------------------------------
            // Message prüfen
            // ----------------------------------------------------

            if (
                data.message === null ||
                data.message === undefined ||
                data.message === ''
            ) {

                log(
                    'Monitoring-Event enthält keine message.',
                    'warn'
                );

                return;
            }


            // ----------------------------------------------------
            // Werte übernehmen
            // ----------------------------------------------------

            const type =
                String(data.type || '').toLowerCase();


            const message =
                String(data.message);


            // ====================================================
            // PUSHOVER SENDEN
            // ====================================================
            //
            // Nur "alarm" wird als Emergency gesendet.
            //
            // ALLES andere wird als normale Nachricht gesendet:
            //
            // - warning
            // - recovered
            // - updateTimeout
            // - zukünftige Event-Typen
            //
            // ====================================================

            if (type === 'alarm' || type === 'timeout') {

                Pushover.Emergency(
                    data.title || 'Alarm',
                    message
                );

            } else {

                Pushover.Normal(
                    data.title || 'Gerätemeldung',
                    message
                );
            }


        } catch (error) {

            // ====================================================
            // ALLGEMEINE FEHLERBEHANDLUNG
            // ====================================================

            log(
                `Fehler bei der Verarbeitung des Monitoring-States: ${error}`,
                'error'
            );
        }
    }
);
