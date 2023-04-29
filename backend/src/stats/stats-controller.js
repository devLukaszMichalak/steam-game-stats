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

    https.createServer(options, app).listen(3000);

    app.get('/api/v1/stats', async (req, res) => {
        statsService.getUserStats((data) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });

    app.get('/api/v1/current-status', async (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');
        const statusDTO = {status: statsService.getCurrentUserStatus()}
        res.send(statusDTO);
    });
}

module.exports = {
    initializeStatsController
}