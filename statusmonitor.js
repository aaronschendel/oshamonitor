const fs = require('fs');
const AsyncPolling = require('async-polling');
const hapi = require('./hiveosApi');


const bearerToken = authorize();

const hiveOsApi = new hapi.HiveosApi(bearerToken);


//beginPolling(bearerToken);


hiveOsApi.isOnline();

function authorize() {
    var configJson = JSON.parse(fs.readFileSync('hiveos_config.json', 'utf8'));
    const bearerToken = configJson.credentials.bearer_token;

    return bearerToken
}


function beginPolling(bearerToken) {
    AsyncPolling(function(end) {
        
    })
}