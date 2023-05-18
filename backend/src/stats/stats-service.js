const statsRepository = require("./stats-repository");

function addMissingZeros(data) {
    const gameNames = [];

    Object.keys(data).forEach(date => {
        Object.keys(data[date]).forEach(gameName => {
            if (!gameNames.includes(gameName)) {
                gameNames.push(gameName);
            }
        })
    })

    Object.keys(data).forEach(date => {
        gameNames.filter(gameName => {
            if (!Object.keys(data[date]).includes(gameName)) {
                data[date][gameName] = 0;
            }
        })
    })

    return data;
}

function reorderData(data) {
    const sortedData = {};
    Object.keys(data)
        .sort()
        .forEach(date => {
            sortedData[date] = data[date];
        });
    return JSON.stringify(sortedData);
}

function formatData(data) {
    return data.reduce((acc, {name, date, minutes_played}) => {
        if (!acc[date]) {
            acc[date] = {};
        }

        if (!acc[date][name]) {
            acc[date][name] = 0;
        }

        acc[date][name] += minutes_played;

        return acc;
    }, {});
}

function getUserStats(callback) {
    statsRepository.getUserStats(data => {
        data = formatData(data);
        data = reorderData(data);
        data = addMissingZeros(data);
        callback(data);
    });
}

function getCurrentUserStatus() {
    let status = statsRepository.getCurrentUserStatus();
    if (status === null) {
        status = "Waiting for status update..."
    }
    return status;
}

module.exports = {
    getUserStats,
    getCurrentUserStatus
}
