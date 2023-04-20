function getCurrentTimestamp() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    return new Date(now.getTime() - timezoneOffset * 60 * 1000);
}

module.exports = {
    getCurrentTimestamp
}