const express = require('express');
const config = require('config');
const router = require('./api/routes/router');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

var corsOptions = {
  origin: '*',
  responseHeader:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  method: 'POST, GET, PUT,PATCH, DELETE, OPTIONS',
  maxAgeSeconds: 120
};

app.use(cors(corsOptions));
app.use(express.json({ extended: false }));
app.use('/api', router);
mongoose.connect("mongodb://localhost/trivia", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err){
  if(err){ console.error(err.message); }
  else{ console.log("Connection to MongoDB successful");
        app.listen(5000, () => {
	  console.log('Server connected at port 5000');
	});
  }
});



