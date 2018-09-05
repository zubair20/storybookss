const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//Passport config
require('./config/passport')(passport);

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Keys config
const keys = require('./config/keys');

//Handlebars helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

//MongoDB connect
mongoose.connect(keys.mongoURI, {useNewUrlParser:true})
 .then(()=>{
   console.log('MongoDB connected'); 
 })
 .catch(err =>{
   console.log(err);
 });

const app = express();

//BodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Methodoverride middleware
app.use(methodOverride('_method'));

//Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
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

//Static folder middleware
app.use(express.static(path.join(__dirname, 'public')));

//Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);


const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`Server is listening on port ${port}`);
  
});