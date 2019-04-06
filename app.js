const createError = require('http-errors');
express = require('express');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
firebaseAdmin = require('firebase-admin');
adminSchema = require('./components/admin/model/admin-model')
constant = require('./Utils/firebase');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/privacy/", express.static(path.join(__dirname, './views/privacy')));



// Process Env file
require('dotenv').config({
  path: './.env'
});

// Database Configuration
mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL).then(() => {
  console.log('MongoDB is connected')
}).catch(err => {
  console.error(err)
})
mongoose.Promise = global.Promise;

// Body Parser
bodyParser = require('body-parser')

app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(express.json({
  limit: '50mb'
}));

// File Upload
path = require('path');
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, './resources/upload')));
fileUpload = require('express-fileupload');
app.use(fileUpload())

// Passport
passport = require('passport');
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
adminSchema = require('./components/admin/model/admin-model')



passport.use(new LocalStrategy({
    useNewUrlParser: true
  },
  function (username, password, done, next) {
    adminSchema.findOne({
      adminUserName: username,
      password: password
    }, function (err, admin) {
      if (admin == null) {
        admin = new adminSchema({
          adminUserName: 'floody7',
          password: 'BmKs5251'
        })

        admin.save();
        //return done(null, false);
      } else {
        return done(null, admin);
      }
    });

  }
));
passport.serializeUser(function (admin, cb) {
  cb(null, admin._id);
});

passport.deserializeUser(function (id, cb) {
  adminSchema.findById({
    _id: id
  }, function (err, admin) {
    if (err) {
      return cb(err);
    }
    cb(null, admin);
  });
});


//Routers

app.get('/',function (req,res,next) {
  res.render('index')
})

constant = require('./Utils/Constants')
routers = require('./routers/api_routers')
adminRouters = require('./routers/admin_routers')
app.use(global.API_BASE_PATH, routers);
app.use(global.ADMIN_BASE_PATH, adminRouters);




//Cors
cors = require('cors')
app.use(cors())


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.send({
    code: 500,
    message: "Sunucuda bir hata oluştu"
  })
  //res.render('error');
});


var admin = require("firebase-admin");

var serviceAccount = require("./auth/firebase");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://floody-d858a.firebaseio.com"
});




app.listen(process.env.PORT)
module.exports = app;