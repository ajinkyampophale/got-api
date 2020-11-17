const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
 
// request body parser 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to mmongo db
mongoose.connect('mongodb+srv://testuser:testuser@cluster0.a7eix.mongodb.net/got?retryWrites=true&w=majority', 
  {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', (err) => {
  console.log("error occured ", err);
  process.exit(0);
});
db.once('open', function() {
  console.log("Connection Successfull");
});

// set view engine as handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// specify routes
app.use('/', require('./routes/getBattles'));

// connect to server
const PORT = 3000;
app.listen(PORT, (err) => {
  if(err){
    console.log(err);
    process.exit(0);
  }
  console.log(`Listening on port ${PORT}`);
});