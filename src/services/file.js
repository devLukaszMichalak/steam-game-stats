const fs = require('fs');

const {getCurrentTimestamp} = require("./date");
const {PERSONA_STATE} = require("../enums/personastate");

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

function appendToLogFile(result) {
    fs.appendFile(GAME_LOGS, result, (error) => {
        if (error) {
            dealWithError(error);
        }
    });
}

function incrementStatsFile(gameName, personaState) {
    if (gameName !== undefined && personaState !== PERSONA_STATE.Snooze && personaState !== PERSONA_STATE.Offline) {
        const dateId = getCurrentTimestamp().toJSON().substring(0, 10);
        fs.readFile(GAME_STATS, (error, data) => {
            if (error) {
                dealWithError(error);
            }

            const jsonData = JSON.parse(data);

            const gameData = jsonData[gameName] || {};
            gameData[dateId] = (gameData[dateId] || 0) + 1;
            jsonData[gameName] = gameData;

            fs.writeFile(GAME_STATS, JSON.stringify(jsonData), (error) => {
                if (error) {
                    dealWithError(error);
                }
            });
        });
    }
}

module.exports = {
    setUpFilesIfNeeded,
    dealWithError,
    appendToLogFile,
    incrementStatsFile
};