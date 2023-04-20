const {setUpFilesIfNeeded} = require("./services/file-service");
const {saveCurrentPlayingGame} = require("./services/steam-api-service");

const steamId = "76561198082805335";

setUpFilesIfNeeded();

console.log(`Started collecting data for steamId: ${steamId}.`)

saveCurrentPlayingGame(steamId);
setInterval(() => saveCurrentPlayingGame(steamId), 60 * 1000);