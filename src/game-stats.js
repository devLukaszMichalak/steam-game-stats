const {setUpFilesIfNeeded} = require("./services/storage/file");
const {saveCurrentPlayingGame} = require("./services/data/steam-api");
const {initializeTables} = require("./services/storage/database");
const express = require('express');
const {initializeDataServer} = require("./services/data/data-server");

const app = express();
const steamId = "76561198082805335";

setUpFilesIfNeeded();
initializeTables()

initializeDataServer(app)

console.log(`Started collecting data for steamId: ${steamId}.`)

setInterval(() => saveCurrentPlayingGame(steamId), 60 * 1000);