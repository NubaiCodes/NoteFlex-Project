//Imports de bibliotecas 
// express tipo de projeto e servidor
var express = require('express');

// encaminhador de pedidos HTTP Get e Post
var router = express.Router();

//importar o schema/modelo de utilizador da mongodb
const userModel = require("../models/user");

//Biblioteca para trabalharmos com datas
const moment = require('moment');
const today = moment().startOf('day');

//Encriptador de passwords
var bcrypt = require('bcryptjs');
const { parseTwoDigitYear } = require('moment');

//multer upload ficheiros
const multer = require('multer');
const path = require('path');
const helpers = require('../helpers');

//importar o modelo das notes
const notesModel = require("../models/notes");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  // saves the file with its original name
  filename: function (req, file, cb) {
    cb(null, file.originalname);

  }
});

var upload = multer({ storage: storage });


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: req.session.user });
});


//GET para mostrar as páginas respetivas e manter a sessão ligada
router.get('/contact', function (req, res, next) {
  res.render('contact', { user: req.session.user });
});

router.get('/directory', async function (req, res, next) {
  notesModel.find(function (err, notes) {
    if (err) {
      res.send(err);
    }
    else {
      res.render("directory", { notes: notes, user: req.session.user });
    }
  });
});

router.get('/subreq', function (req, res, next) {
  if (req.session && req.session.user) {
    res.render('subreq', { user: req.session.user });
  } else {
    res.sendStatus(403);
  }
});

router.get('/account', async function (req, res, next) {
  if (req.session && req.session.user) {
    notesModel.find({ userId: req.session.userId }, function (err, notes) {
      if (err) {
        res.send(err);
      }
      else {
        res.render("account", { notes: notes, user: req.session.user });
      }
    });
  } else {
    res.sendStatus(403);
  }
});

router.post('/document', function (req, res, next) {
  res.download('./uploads/' + req.body.pathname)
});


router.post('/submit', upload.single('document'), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  req.body.userId = req.session.userId;
  req.body.filePath = file.originalname;

  const note = new notesModel(req.body);
  try {
    await note.save();
    res.redirect("back");
  } catch (err) {
    res.status(500).send(err);
  }

})


router.post("/login", (req, res) => {

  userModel.findOne({ email: req.body.email }, function (err, user) {


    if (user) {


      bcrypt.compare(req.body.password, user.password, function (err, result) {

        if (result === true) {

          req.session.user = user;
          req.session.userId = user.id;


          res.render("index", { user: req.session.user });


        } else {
          res.render("index", { message: "Invalid Password" });
        }
      });

    } else {
      res.render("index", { message: "Email not found, please try another.", type: "error" });
    }
  });
});


router.post("/register", async (req, res) => {
  //Encriptar a password
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  //Trocar a password para a encriptada
  req.body.password = hash;

  //Tenta guardar o novo utilizador na base de dados
  const user = new userModel(req.body);
  try {
    await user.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }

});

router.post("/updatepass", (req, res) => {
  if (req.body.newpass == req.body.confirmpass) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.newpass, salt);

    userModel.findByIdAndUpdate(req.session.userId, { password: hash }, function (err, result) {
      if (!err) {
        res.redirect("account");
      } else {
        res.render("account", { message: "Password could not be updated.", type: "error" });
      }
    });
  } else {
    res.sendStatus(418);
  }
});

//Faz logout do user
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/') // will always fire after session is destroyed
  })
});

//operação apagar dados
router.get("/deleteAccount", async function (req, res) {
  if (req.session && req.session.userId) {
    let deleted = userModel.deleteOne({ _id: req.session.userId }).exec();

    if (deleted) {
      //Termina a sessão
      //Redireciona para a página principal
      req.session.destroy((err) => {
        res.render("index", { message: "Account deleted. Sorry to see you go :(", type: "error" });
      })
    } else {
      res.render("index", { message: "Could not delete account. Please try again later.", type: "error" });
    }
  }
});

router.post("/deletenote", function (req, res) {
  notesModel.findByIdAndDelete(req.body.idnote, function (err, doc) {
    if (err) {
      res.send("File could not be deleted.");
    }
    else {
      res.redirect("/account");
    }
  })
});

module.exports = router;
