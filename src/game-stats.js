const {setUpFilesIfNeeded} = require("./services/file");
const {saveCurrentPlayingGame} = require("./services/steam-api");
const {initializeTables} = require("./services/database");

const steamId = "76561198082805335";

setUpFilesIfNeeded();
initializeTables()

console.log(`Started collecting data for steamId: ${steamId}.`)

setInterval(() => saveCurrentPlayingGame(steamId), 60 * 1000);