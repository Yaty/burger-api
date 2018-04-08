const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const projectInfo = require('../package.json');
const logger = require('./utils/logger')('app');

const app = express();

app.use(morgan('combined', {
  stream: {
    write(message) {
        logger.info(message.trim());
    },
  },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, 'public')));

const apiVersion = projectInfo.version.split('.')[0];
app.use('/v' + apiVersion, require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
