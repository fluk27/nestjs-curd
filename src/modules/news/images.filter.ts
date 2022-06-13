import { BadRequestException } from "@nestjs/common"

export const imagefilter=(req:any, file:any, callback:any)=> {
   if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|)$/)) {
     return callback(new BadRequestException(' file type images only.'),false)
   }
  console.log("fileSize:",file);
  
   callback(null,true)
}