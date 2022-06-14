import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { HelpersMinioService } from './minio.service';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports:[  MinioModule.register({
    endPoint:process.env.MINIO_ENDPOINT,
    useSSL:false,
    port:Number(process.env.MINIO_PORT),
    accessKey:process.env.MINIO_ACCESS_KEY,
    secretKey:process.env.MINIO_SECERT_KEY
  }),],
  controllers: [MinioController],
  providers: [HelpersMinioService],
  exports:[HelpersMinioService]
})
export class HelpersMinioModule {}
