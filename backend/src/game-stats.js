const log = require("./logs/log");
const statsRepository = require("./stats/stats-repository");
const statsController = require("./stats/stats-controller");
const {saveCurrentPlayingGame} = require("./steam-api/steam-api");

const steamId = "76561198082805335";

log.setUpLogFileIfNeeded();
statsRepository.initializeTables()

statsController.initializeStatsController()

console.log(`Started collecting data for steamId: ${steamId}.`)

setInterval(() => saveCurrentPlayingGame(steamId), 60 * 1000);