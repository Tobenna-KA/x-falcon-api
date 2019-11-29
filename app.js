let createError = require('http-errors');
let mongoose = require('mongoose');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let auth = require('./app/auth/controllers').security
let user = require('./app/user/controllers').user
let team = require('./app/team/controllers').team
let task = require('./app/task/controllers').task
let report = require('./app/report/controllers').report

let jwt = require('./helpers/general/jwt')

let app = express();

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//connect to db
mongoose.connect('mongodb://localhost:27017/x_falcon', {useNewUrlParser: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

let base_url = '/api'

//auth routes
app.post(base_url + '/auth/login', auth.LOGIN);
app.post(base_url + '/auth/change/password', auth.CHANGE_PASSWORD);
app.post(base_url + '/auth/request/otp', auth.REQUEST_PASSWORD_RECOVERY);
app.post(base_url + '/auth/complete/otp', auth.COMPLETE_PASSWORD_RECOVERY);

//user routes
app.post(base_url + '/new/user', user.NEW_USER);
app.post(base_url + '/get/user', user.GET_USER);
app.post(base_url + '/get/users', user.GET_USERS);
app.post(base_url + '/activate/user', user.ACTIVATE_USER);
app.post(base_url + '/edit/user', user.EDIT_USER);

//team routes
app.post(base_url + '/new/team', team.NEW_TEAM);
app.post(base_url + '/get/team', team.GET_TEAM);
app.post(base_url + '/get/teams', team.GET_TEAMS);
app.post(base_url + '/edit/team', team.EDIT_TEAM);
app.post(base_url + '/new/teammate', team.NEW_TEAMMATE);
app.post(base_url + '/remove/teammate', team.REMOVE_TEAMMATE);
app.post(base_url + '/activate/team', team.ACTIVATE_TEAM);
app.post(base_url + '/merge/teams', team.MERGE_TEAMS);

//task routes
app.post(base_url + '/new/task', task.NEW_TASK)
app.post(base_url + '/get/task', task.GET_TASK)
app.post(base_url + '/get/tasks', task.GET_TASKS)
app.post(base_url + '/get/tasks', task.GET_TASKS)
app.post(base_url + '/edit/task', task.EDIT_TASK)
app.post(base_url + '/update/task', task.UPDATE_TASK)
app.post(base_url + '/complete/task', task.COMPLETE_TASK)
app.post(base_url + '/delete/task', task.DELETE_TASK)

//report routes
app.post(base_url + '/new/report', report.NEW_REPORT)
app.post(base_url + '/get/report', report.GET_REPORT)
app.post(base_url + '/get/reports', report.GET_REPORTS)
app.post(base_url + '/draft/report', report.DRAFT_REPORT)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * ensureAndVerify
 * @param req
 * @param res
 * @param next
 */
function ensureAndVerify(req, res, next) {
  // console.log(req.body.authorization,  req.headers["authorization"])
  let authorization = ( req.headers["authorization"] )? req.headers["authorization"] : req.body.authorization;

  jwt.ensureToken(authorization, (token) => {
    if(!token)
      res.sendStatus(403);
    else
      jwt.verifyToken({token, verifyOpt: req.body.verifyOpt}, (_res) => {
        // console.log(_res)
        if (!_res.error) {
          next()
        }else{
          res.status(200).send({auth: false});
        }
      })
  })
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
