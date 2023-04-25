const statsService = require("./stats-service");
const express = require('express');

function initializeDataServer() {
    const app = express();

    app.get('/stats', async (req, res) => {
        statsService.getUserStats((data) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });

    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}

module.exports = {
    initializeStatsController: initializeDataServer
}