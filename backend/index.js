const express = require('express');
const app = express();
const routes = require('./routes/userEntryRoute');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//setting static folder for images retrival
app.use(express.static('./uploads',{root:__dirname}));

//doing the configuration for the environment variable for security reasons
dotenv.config();

//connectng to the mongodb atlas
//mongoose package makes it very easy to work with mongodb
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex:true },(err)=>{
    if(err)console.log(err);
    console.log('db connected successfully');
    //running the server on port 5000
    app.listen(5000, e => e ? console.log(e) : console.log('up and runnng') )
})

//using the cors package to deal with the issues of data flow over the network
app.use(cors());

//converting the data received to readable form
app.use(express.json());

//using the routes package to handle different types of route parameters
app.use(routes);