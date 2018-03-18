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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger[err.status >= 500 ? 'error': 'info']('Express error handler.', {err});

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
