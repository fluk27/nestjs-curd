import { BadRequestException } from "@nestjs/common"

export const imagefilter=(req:any, file:any, callback:any)=> {
   if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|)$/)) {
     return callback(new BadRequestException(' file type images only.'),false)
   }else{
    file.fileName=`${new Date().getTime()}-${file.originalname}`
    callback(null,true)
   }
  console.log("fileSize:",file);
  
 
}