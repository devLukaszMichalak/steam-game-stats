const {getUserStats} = require("../storage/database");

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

function initializeDataServer(app) {
    app.get('/stats', async (req, res) => {
        getUserStats((data) => {
            res.send(formatData(data));
        });
    });

    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}

module.exports = {
    initializeDataServer
}