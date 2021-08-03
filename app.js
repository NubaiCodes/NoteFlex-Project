//Importar bibliotecas necessárias
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Importar o router para os encaminhamentos
var indexRouter = require('./routes/index');

//Importar o bodyParser
const bodyParser = require('body-parser');

var app = express();

//Imports relacionados com base de dados e sessão
var mongoose = require('mongoose');
var session = require("express-session");
var MongoStore = require('connect-mongodb-session')(session);


//Trocar o link pelo originado no vosso mongodb atlas e a password
//Conexão à base de dados
const connection = "mongodb+srv://catarina:nubaicodes@noteflexcluster.shnbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//Estabelecer ligação
mongoose.connect(connection, {
  useNewUrlParser: true
});

var store = new MongoStore({
  uri: "mongodb+srv://catarina:nubaicodes@noteflexcluster.shnbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  collection: 'sessions'
});

app.use(session({
  secret: '@349t3jfsnL',
  resave: true,
  //Controlo do tempo que dura uma sessão
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  },
  saveUninitialized: false,
  store: store
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Usar o body parser para ler o corpo dos HTTP Post
app.use(bodyParser.urlencoded({ extended: true }));


//Torna a pasta public visivel para os utilizadores da app
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

app.use(function (req, res, next) {
  res.status(403).render('account');
});

module.exports = app;