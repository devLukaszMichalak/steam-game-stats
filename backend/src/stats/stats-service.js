const statsRepository = require("./stats-repository");

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