const https = require('https');

const log = require("../logs/log");
const {getCurrentTimestamp} = require("../utils/date");
const statsRepository = require("../stats/stats-repository");
const {STEAM_API_KEY} = require("../environments/environment");
const {mapPersonStatus, PERSONA_STATE} = require("../utils/personastate");

const apiKey = STEAM_API_KEY

function getFormattedResult(gameName, personName, timestamp, personaState) {
    if (gameName !== undefined) {
        return `${personName} at ${timestamp} is playing ${gameName}. Status: ${mapPersonStatus(personaState)}\n`;
    } else {
        return `${personName} at ${timestamp} is not playing any game. Status: ${mapPersonStatus(personaState)}\n`;
    }
}

function getFormattedCurrentStatus(gameName, personaState) {
    if (gameName !== undefined) {
        return `Status: ${mapPersonStatus(personaState)}. Currently playing game: ${gameName}.`;
    } else if(personaState !== PERSONA_STATE.Offline) {
        return `Status: ${mapPersonStatus(personaState)}. Currently no game is being played.`;
    } else {
        return `Status: ${mapPersonStatus(personaState)}.`;
    }
}

function extractGameInformation(data) {
    const players = JSON.parse(data).response.players
    if (players.length === 0) {
        const error = `No such player found!`;
        log.error(error);
    }
    const thePlayer = players[0]
    const gameName = thePlayer.gameextrainfo;
    const personName = thePlayer.personaname;
    const personaState = thePlayer.personastate;
    return {gameName, personName, personaState};
}

function dealWithResponse(response) {
    let data = '';
    response.on('data', (chunk) => {
        data += chunk;
    });
    response.on('end', () => {
        const {gameName, personName, personaState} = extractGameInformation(data);
        const timestampString = getCurrentTimestamp().toISOString();
        const resultLog = getFormattedResult(gameName, personName, timestampString, personaState);
        const status = getFormattedCurrentStatus(gameName, personaState);

        log.appendLogFile(resultLog);
        statsRepository.setCurrentUserStatus(status);
        statsRepository.updateUserStats(gameName, personaState);
    });
}

function saveCurrentPlayingGame(steamId) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            dealWithResponse(response);
        } else {
            log.error(`Steam api responded with status code: ${response.statusCode}`);
        }
    }).on('error', (error) => {
        log.error(error);
    });
}

module.exports = {
    saveCurrentPlayingGame
}