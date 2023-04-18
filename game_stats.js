const fs = require('fs');
const https = require('https');

const apiKey = "STEAM_API_KEY";
const steamId = "76561198082805335";
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

function getCurrentTimestamp() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() + 120;
    const timestamp = new Date(now.getTime() - timezoneOffset * 60 * 1000).toISOString();
    return timestamp;
}

function dealWithError(error) {
    fs.appendFileSync(game_logs, `${getCurrentTimestamp()}: ${error}\n`);
}

function getFormattedResult(gameName, personName, timestamp) {
    if (gameName !== undefined) {
        return `${personName} at ${timestamp} is playing ${gameName}\n`;
    } else {
        return `${personName} at ${timestamp} is not playing any game\n`;
    }
}

function appednToLogFile(result) {
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

    const dateId = (new Date()).toJSON().substring(0, 10);

    fs.readFile(game_stats, (error, data) => {
        if (error) {
            dealWithError(error)
        }

        const jsonData = JSON.parse(data);

        const gameData = jsonData[gameName] || {};
        gameData[dateId] = (gameData[dateId] || 0) + 1;
        jsonData[gameName] = gameData;

        fs.writeFile(game_stats, JSON.stringify(jsonData), (error) => {
            if (error) {
                dealWithError(error)
            }
        });
    });
}

function extractGameInformation(data) {
    const players = JSON.parse(data).response.players
    if (players.length === 0) {
        const error = `No such player found!`;
        dealWithError(error);
    }
    const thePlayer = players[0]
    const gameName = thePlayer.gameextrainfo;
    const personName = thePlayer.personaname;
    return {gameName, personName};
}

function dealWithResponse(response) {
    let data = '';
    response.on('data', (chunk) => {
        data += chunk;
    });
    response.on('end', () => {
        const {gameName, personName} = extractGameInformation(data);
        const timestamp = getCurrentTimestamp();
        const resultLog = getFormattedResult(gameName, personName, timestamp);

        appednToLogFile(resultLog);
        incrementStatsFile(gameName);
    });
}

function saveCurrentPlayingGame() {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            dealWithResponse(response)
        } else {
            dealWithError(response.statusCode);
        }
    }).on('error', (error) => {
        dealWithError(error);
    });
}

setUpFilesIfNeeded();
saveCurrentPlayingGame();
setInterval(() => saveCurrentPlayingGame(), 60 * 1000);