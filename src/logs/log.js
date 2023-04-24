const fs = require('fs');

const {getCurrentTimestamp} = require("../utils/date");

const GAME_LOGS = 'game_logs.txt';

function setUpLogFileIfNeeded() {
    if (!fs.existsSync(GAME_LOGS)) {
        fs.writeFileSync(GAME_LOGS, '');
    }
}

function logError(error) {
    console.log(error);
    fs.appendFileSync(GAME_LOGS, `${getCurrentTimestamp().toISOString()}: ${error}\n`);
}

function appendLogFile(result) {
    fs.appendFile(GAME_LOGS, result, (error) => {
        if (error) {
            logError(error);
        }
    });
}

module.exports = {
    setUpLogFileIfNeeded,
    error: logError,
    appendLogFile
};