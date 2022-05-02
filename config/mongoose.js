const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/uploadDB');

const db = mongoose.connection;

db.on('error',function(err){
   console.log('Error occured during setup of MongoDB ',err);
   return;
});

db.once('open',function(){
  console.log('DB setup done');
  return;
});

module.exports = db;