const {Pool} = require('pg');
const {getCurrentTimestamp} = require("../utils/date");
const {POSTGRES_POOL} = require("../environments/environment");
const {PERSONA_STATE} = require("../utils/personastate");
const log = require("../logs/log");

const pool = new Pool(POSTGRES_POOL);

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS game_data (
    id SERIAL PRIMARY KEY,
    game_id INTEGER,
    date TEXT,
    minutes_played INTEGER,
    FOREIGN KEY (game_id) REFERENCES games(id),
    UNIQUE (game_id, date)
  );
`;


function initializeTables() {
    pool.query(createTablesQuery, (error, res) => {
        if (error) {
            log.error(error);
        }
    });
}

function getUpdateUserSQL(gameName, date) {
    return `INSERT INTO games (name) SELECT ('${gameName}') WHERE NOT EXISTS (SELECT 1 FROM games WHERE name = '${gameName}');
            INSERT INTO game_data (game_id, date, minutes_played) 
            VALUES ((SELECT id FROM games WHERE name = '${gameName}'),'${date}', 1)
            ON CONFLICT (game_id, date) 
            DO UPDATE SET minutes_played = game_data.minutes_played + 1;`;
}

function updateUserStats(gameName, personaState) {
    if (gameName !== undefined && personaState !== PERSONA_STATE.Snooze && personaState !== PERSONA_STATE.Offline) {
        const date = getCurrentTimestamp().toJSON().substring(0, 10);
        pool.query(getUpdateUserSQL(gameName, date), (error, res) => {
            if (error) {
                log.error(error);
            }
        });
    }
}

function getUserStats(callback) {
    pool.query(`SELECT games.name, game_data.date, game_data.minutes_played
                FROM game_data JOIN games ON game_data.game_id = games.id;`, (error, results) => {
        if (error) {
            log.error(error);
        }
        callback(results.rows);
    });
}

module.exports = {
    initializeTables,
    updateUserStats,
    getUserStats
}