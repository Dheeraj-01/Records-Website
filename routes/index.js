var express = require('express');
var router = express.Router();
var userModel = require('../modules/user');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');


// initilize Local Storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// finction Check User Login or not
function checkLoginUser(req,res,next){
  try {
    var userToken=localStorage.getItem('userToken');
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}



// check if userEmail dublicate or not Middleware
function checkEmail(req,res,next){
  var email = req.body.email;
  var databaseValue = userModel.findOne({email:email});
  databaseValue.exec((err,data)=>{
    if(err)throw err;
    if(data) return  res.render('signup', { title: 'Sign Up' ,msg : 'Email Already Exists'});
    next();
  });
  
}

/* GET login page. */
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/home');
  }
  else res.render('login', { title: 'Login', msg : ''  });
});

/* GET login page. */
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var checkExistEmail = userModel.findOne({email:email});
  checkExistEmail.exec((err,data)=>{
    if(err)throw err;
    if(data){
      var getPassaword = data.password;
      var getUserID = data._id;
      if(bcrypt.compareSync(password,getPassaword)){
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', email);
        res.redirect('/home');
      }
      else res.render('login', { title: 'Login', msg : 'In Valid Password or Email' });
    }
    else{
      res.render('login', { title: 'Login', msg : 'In Valid Password or Email' });
    }
  });
});


// Get sign Up Page
router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/home');
  }
  else res.render('signup', { title: 'Sign Up' ,msg : ''});
});

// post sign Up Page
router.post('/signup',checkEmail, function(req, res, next) {

  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  if(password == cpassword){
    password =bcrypt.hashSync(password,10);
    var useDetails = new userModel({
      email:email,
      password:password,
    });
  
    useDetails.save((err,data) => {
      if(err)throw err;
      res.render('login', { title: 'Login', msg : 'User Registered Successfully'});
    });
  }
  else{
    res.render('signup', { title: 'Sign Up' ,msg : 'InCorrect Confirm Password'});
  }
  
});


// Get Home Page
router.get('/home',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('index', { title: 'Records Management System', loginUser:loginUser});
});

// Get add-table Page
router.get('/add-table',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('addTable', {title: 'Records Management System', loginUser : loginUser});
});

// Get all-tables Page
router.get('/all-tables',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('AllTables', {title: 'Records Management System', loginUser : loginUser});
});

// Get find-table-by-name Page
router.get('/find-table-by-name',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('FindTablesByName', {title: 'Records Management System', loginUser : loginUser});
});

// Get add-table-data-by-name Page
router.get('/add-table-data-by-name',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('AddTableDataByName', {title: 'Records Management System', loginUser : loginUser});
});

// Get logout Page
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


module.exports = router;
