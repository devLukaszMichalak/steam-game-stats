const PERSONA_STATE = {
    Offline: 0,
    Online: 1,
    Busy: 2,
    Away: 3,
    Snooze: 4,
    LookingToTrade: 5,
    LookingToPlay: 6,
};

function mapPersonStatus(status) {
    switch (status) {
        case 0: return 'Offline'
        case 1: return 'Online'
        case 2: return 'Busy'
        case 3: return 'Away'
        case 4: return 'Snooze'
        case 5: return 'LookingToTrade'
        case 6: return 'LookingToPlay'
    }
}

module.exports = {
    PERSONA_STATE,
    mapPersonStatus
}