const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const path = require('path');
const config = require('../../config').logger;

module.exports = function(name) {
    return bunyan.createLogger({
        name: 'burger-api:' + name,
        level: config.level,
        streams: [
            {
                stream: bformat({outputMode: 'short'}),
            },
            {
                path: path.resolve(__dirname, '../burger-api.log'),
            },
        ],
    });
};
