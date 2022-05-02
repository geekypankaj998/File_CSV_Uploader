const FileObj = require('../modals/fileObj');
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');

module.exports.home = async function(req,resp){
    try{

      let fileAll = await FileObj.find({});
      
      return resp.render('home',{
        title:'Home',
        fileList : fileAll
      });

    }catch(err){
      console.log(' Error occured ',err);
      return;
    } 
}

module.exports.upload = function(req,resp){
  try{
      FileObj.uploadedFile(req,resp,function(err){
        if(err){
           console.log('Error ',err);
           return;
        }

        if(req.file){ // Now getting the file to store and save info
          let pathFile = FileObj.path_file+'/'+req.file.filename;
        
         FileObj.create({
          fileLocation :  pathFile
         }).then(()=>{console.log('Upload done')})
           .catch((err)=>{
            console.log(' Error Occured : ',err);
          }); 
          req.flash("success", "File Uploaded Successfull :)");
          return resp.redirect('back');
        }
        // If no file is sent only info update request is made
        else{
           req.flash("error", "Some Error Occured Check Logs !!!");
           return resp.redirect('back'); 
        }
      });
  }catch(err){
      console.log('Erro occured ',err);
      return;
  }
  
}

module.exports.uploadViaAPI = async(req,resp)=>{
  try{
      FileObj.uploadedFile(req,resp,function(err){
        if(err){
           return resp.status(400).json({
             message : "Error in uploading file"
           });
        }

        if(req.file){ // Now getting the file to store and save info
          let pathFile = FileObj.path_file+'/'+req.file.filename;
         FileObj.create({
          fileLocation :  pathFile
         }).then(()=>{console.log('Upload done')})
           .catch((err)=>{
            console.log(' Error Occured : ',err);
          }); 
          req.flash("success", "File Uploaded Successfull :)");
          return resp.status(200).json({
            message : "Upload Succefull",
            file:req.file,
            fileLoc : pathFile 
          });
        }
        else{
           req.flash("error", "Some Error Occured Check Logs !!!");
           return resp.status(400).json({
            message : "File Mismatch"
          });
        }
      });

  }catch(err){
    req.flash('error',"Error Occured while uploading");
    return resp.status(500).json({
      message : "Internal Server Error"
    });
  }
}

module.exports.view =async function(req,resp){
    console.log('View Loaded :)');
    let fileClicked = await FileObj.findById(req.params.id);
    console.log("Clicked File ID => "+fileClicked);
    let csvFileUrl = fileClicked.fileLocation;
    
    console.log(csvFileUrl);

    // (B) READ CSV FILE
    var results = [];
    fs.createReadStream(path.join(__dirname,'..',csvFileUrl))
    .pipe(csv())    
    .on("data", (data) => results.push(data))
    .on("end", () => {
         console.log("First Record "+ results[0] +" all records "+results);
        
         return resp.render('viewUpload',{
           basicRecord : results[0],
           allRecords : results,
           title : 'CSV View'
         });
    })
    
};

module.exports.delFile =async function(req,resp){
  
  try{
    let currId = req.params.id;
    let currentFile = await FileObj.findById(currId);
    let pathToFile = path.join(__dirname,"../",currentFile.fileLocation);  
    //removing file from the stored Location 
    fs.unlinkSync(pathToFile);
    let currFileObj = await FileObj.findByIdAndDelete(currId);
    //deleting file 

    req.flash("error","File Removed !!!");
    
    return resp.redirect('back');

 
}catch(err){
  console.log("Error occured while Deleting :(",err);
  return; 
}
}