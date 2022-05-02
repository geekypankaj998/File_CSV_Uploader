const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const PATH_FILE = path.join("/uploads");

const fileSchema = new mongoose.Schema({
  
    fileLocation : {
         type:String
       }
},{     
      timestamps :true
  });


  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',PATH_FILE));
    },
    filename: function (req, file, cb){
      cb(null, file.fieldname + '-' + file.originalname);   //+'.png'
    }
  });
   //making multer understand that where is the destination and how to store file in the destination 
    
  let csvFilter = function(req, file, cb) {
    if (file.mimetype == "text/csv") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .csv format allowed!'),false);
    }
  }
   //static 
  
  fileSchema.statics.uploadedFile =  multer({ 
    storage: storage,
    fileFilter : csvFilter
  }).single('fileInp'); 
  //exposing this path to outer files if needed so can be accessed as needed
  fileSchema.statics.path_file = PATH_FILE;
  
  
  const File = mongoose.model('FileObj',fileSchema);
  
  module.exports = File;