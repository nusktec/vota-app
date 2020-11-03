let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');
let jsonParser = bodyParser.json();
let logger = require('morgan');
let modelInitializer = require('./models/init');
let auth = require('./auth/auth');
let util = require('./utils/utils');

let indexRouter = require('./routes/index');
let configRouter = require('./routes/config');
let adminRouter = require('./routes/admin');
let usersRouter = require('./routes/users');
let publicRouter = require('./routes/public');

let app = express();

//run models
new modelInitializer();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(jsonParser);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//manage cors
app.options('*', cors());
//top level app middle ware and header control
app.use(auth.allowHeaders);
app.use(auth.friendToken);
//start routing
app.use('/', indexRouter);
//handshake
app.use('/api/handshake', (req, res, next) => {
    util.Jwr(res, {code: 200, error: 2000, action: true}, []);
});
//main api
app.use('/api/config', configRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', usersRouter);
app.use('/api/public', publicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    util.Jwr(res, {code: 404, error: 1004, action: false}, [])
});

module.exports = app;
