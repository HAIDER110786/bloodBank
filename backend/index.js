const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//setting static folder for images retrival
app.use(express.static('./uploads',{root:__dirname}));

//doing the configuration for the environment variable for security reasons
dotenv.config();

//using the cors package to deal with the issues of data flow over the network
app.use(cors());


//how to move the logic below on a separate file
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex:true },err=>{
    if(err)console.log(err);
    console.log('db connected successfully');
    //running the server on port 8000 or 8080
    app.listen(process.env.PORT || 8080, e => e ? console.log(e) : console.log(`up and running on port ${process.env.PORT}`) )
})


//converting the data received to readable form
app.use(express.json());

//using the routes package to handle different types of route parameters
app.use(routes);