const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

//Passport config
require('./config/passport')(passport);

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//Keys config
const keys = require('./config/keys');

//MongoDB connect
mongoose.connect(keys.mongoURI, {useNewUrlParser:true})
 .then(()=>{
   console.log('MongoDB connected'); 
 })
 .catch(err =>{
   console.log(err);
 });

const app = express();

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Cookie parser and session middlewares
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave:false,
  saveUninitialized:false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req,res, next)=>{
  res.locals.user = req.user || null;
  next();
});

//Use Routes
app.use('/auth', auth);
app.use('/', index);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`Server is listening on port ${port}`);
  
});