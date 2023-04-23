const {getUserStats} = require("../storage/database");

function initializeDataServer(app) {
    app.get('/stats', async (req, res) => {
        getUserStats((data) => {
            res.send(data);
        });
    });

    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}

module.exports = {
    initializeDataServer
}