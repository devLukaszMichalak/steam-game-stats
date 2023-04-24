const fs = require('fs');

const {getCurrentTimestamp} = require("../utils/date");

const GAME_LOGS = 'game_logs.txt';
const GAME_STATS = 'game_stats.json';

function setUpFilesIfNeeded() {
    if (!fs.existsSync(GAME_LOGS)) {
        fs.writeFileSync(GAME_LOGS, '');
    }
    if (!fs.existsSync(GAME_STATS)) {
        fs.writeFileSync(GAME_STATS, '{}');
    }
}

function dealWithError(error) {
    console.log(error);
    fs.appendFileSync(GAME_LOGS, `${getCurrentTimestamp().toISOString()}: ${error}\n`);
}

function appendLogFile(result) {
    fs.appendFile(GAME_LOGS, result, (error) => {
        if (error) {
            dealWithError(error);
        }
    });
}

module.exports = {
    setUpFilesIfNeeded,
    dealWithError,
    appendLogFile
};