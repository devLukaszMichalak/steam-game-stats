const statsRepository = require("./stats-repository");

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
        callback(formatData(data));
    });
}

module.exports = {
    getUserStats,
}