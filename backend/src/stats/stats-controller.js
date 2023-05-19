const statsService = require("./stats-service");
const express = require('express');
const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync("cert/key.pem"),
    cert: fs.readFileSync("cert/cert.pem")
};

function initializeStatsController() {
    const app = express();
    const port = 3000;

    https.createServer(options, app).listen(port);

    app.get('/api/v1/stats', async (req, res) => {
        statsService.getUserStats((data) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });

    app.get('/api/v1/pureStats', async (req, res) => {
        statsService.getUserPureStats((data) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });

    app.get('/api/v1/current-status', async (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');
        const statusDTO = {status: statsService.getCurrentUserStatus()}
        res.send(statusDTO);
    });

    console.log(`Server is listening on: ${port}. Visit https://localhost:${port}/api/v1/pureStats`)
}

module.exports = {
    initializeStatsController
}
