const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const path = require('path');
const config = require('../config').logger;

module.exports = function(name) {
    return bunyan.createLogger({
        name: 'burger-api:' + name,
        level: config.level,
        streams: [
            {
                stream: bformat({outputMode: 'short'}),
            },
            {
                type: 'rotating-file',
                period: '1d', // daily rotation
                count: 7, // keep 7 back copies
                path: path.resolve(__dirname, '../burger-api.log'),
            },
        ],
    });
};
