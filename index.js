require('dotenv').config()
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const db = require('./config/mongoose');
const FileObj = require('./modals/fileObj');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const customMware = require('./config/middleware');

app.use(express.urlencoded({
  extended:true                //Fetching content during Posting from Forms 
})); 

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'./assets')));
app.use(expressLayouts);   //This needs to be done before routing as there we are using views

app.use('/uploads',express.static(path.join(__dirname+'/uploads')));
//this is used to extract styles and scripts for sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));

app.use(session({
  name : 'uploaderBay>>',
  //this helps in encryption will set it whe will be deploying the code on server
  secret : "secretT",
  saveUninitialized : false,          //when the user not logged in or identity is not established don't keep any info in cookie anything about him 
  resave:false                       // that means rewriting the cookie again and again
}));

app.use(flash());     //Now flash can access session to store messages
app.use(customMware.setFlash); //Requring custom Middleware for adding req to resp flash obj 

app.use('/',require('./routes'));

app.listen(port,function(err){
   if(err){
    console.log('Error occured : ',err);
    return;
   }
   console.log('Server started at : ',port);
 }
);