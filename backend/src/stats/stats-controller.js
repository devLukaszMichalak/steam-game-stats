const statsService = require("./stats-service");
const express = require('express');
const fs = require('fs');
const https = require('https');

const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
};

function initializeDataServer() {
    const app = express();

    app.get('/stats', async (req, res) => {
        statsService.getUserStats((data) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });

    https.createServer(options, (req, res) => {
        console.log('Server is listening on port 3000');
    }).listen(3000);
}

module.exports = {
    initializeStatsController: initializeDataServer
}