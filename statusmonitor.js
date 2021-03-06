//============ CONFIG/ENV VARS ==========
const fs = require('fs');
const twilio = require('twilio');
const hapi = require('./hiveosApi');

var configJson = JSON.parse(fs.readFileSync('oshamonitor_config.json', 'utf8'));
const bearerToken = configJson.hiveos.bearer_token;
const alertRecipient = configJson.twilio.alert_recipient;
const twilioNumber = configJson.twilio.twilio_number;
const twilioAccountSid = configJson.twilio.account_sid; 
const twilioAuthToken = configJson.twilio.auth_token;
const refreshInterval = configJson.general.refresh_interval;
const endMonitoringAfterAlert = configJson.general.end_monitoring_after_alert;

const hiveOsApi = new hapi.HiveosApi(bearerToken);
const twilioClient = new twilio(twilioAccountSid, twilioAuthToken);
//========================================


beginPolling();

async function beginPolling() {
    try {
        var myInterval = setInterval(async function() {
            let online = await hiveOsApi.isOnline();

            if (online === true) {
                console.log('Your worker is online and doing their job!');
            }
            else {
                console.log("Worker Status Alert! Online = " + online);
                sendText('Mining rig is offline! Fix this!', alertRecipient, twilioNumber)
                
                if (endMonitoringAfterAlert === 'true') {
                    clearInterval(myInterval); // End polling if offline to avoid sending many texts
                }
            }
        }, refreshInterval);
    }
    catch(e) {
        console.log(e);
    }
}

function sendText(message, to, from) {
    twilioClient.messages.create({
        body: message,
        to: to, 
        from: from
    }).then((message) => console.log(message.sid));
}