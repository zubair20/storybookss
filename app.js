const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');

const app = express();

//Use Routes
app.use('/auth', auth);

app.get('/',(req, res)=>{
  console.log('it works');
  
});
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`Server is listening on port ${port}`);
  
});