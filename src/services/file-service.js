const fs = require('fs');

const {getCurrentTimestamp} = require("./date-service");

const game_logs = 'game_logs.txt';
const game_stats = 'game_stats.json';

function setUpFilesIfNeeded() {
    if (!fs.existsSync(game_logs)) {
        fs.writeFileSync(game_logs, '');
    }
    if (!fs.existsSync(game_stats)) {
        fs.writeFileSync(game_stats, '{}');
    }
}

function dealWithError(error) {
    console.log(error);
    fs.appendFileSync(game_logs, `${getCurrentTimestamp().toISOString()}: ${error}\n`);
}

function appendToLogFile(result) {
    fs.appendFile(game_logs, result, (error) => {
        if (error) {
            dealWithError(error);
        }
    });
}

function incrementStatsFile(gameName) {
    if (gameName === undefined) {
        gameName = 'no_game';
    }

    const dateId = getCurrentTimestamp().toJSON().substring(0, 10);

    fs.readFile(game_stats, (error, data) => {
        if (error) {
            dealWithError(error);
        }

        const jsonData = JSON.parse(data);

        const gameData = jsonData[gameName] || {};
        gameData[dateId] = (gameData[dateId] || 0) + 1;
        jsonData[gameName] = gameData;

        fs.writeFile(game_stats, JSON.stringify(jsonData), (error) => {
            if (error) {
                dealWithError(error);
            }
        });
    });
}

module.exports = {
    setUpFilesIfNeeded,
    dealWithError,
    appendToLogFile,
    incrementStatsFile
};