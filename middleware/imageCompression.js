const sharp = require("sharp"); 
const fs = require("fs"); 
const path = require("path"); 

module.exports = async (req, res, next) =>{

    const directoryPath =  path.join(__dirname, "../images");

      const { buffer, originalname } = req.file;
 
      const timestamp = Date.now().toString(); 
      const filename = originalname.split(".")[0].replace(" ", "_");
     
      const ref = `${timestamp}-${filename}.webp`;
      try{
        await sharp(buffer)
        .webp({ quality: 60 })
        .resize({
          width: 600,
          height: null
        })
        .toFile(directoryPath + "/" + ref);
        req.imageUrl = ref; 
        next(); 
      }catch(e){
        res.status(500).json(e)
      }
      
}