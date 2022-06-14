import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';

@Injectable()
export class HelpersMinioService {
  constructor(private readonly minioService: MinioService) {}
  private async checkBucket(name: string): Promise<boolean> {
    return await this.minioService.client.bucketExists(name);
  }
  private async makeBucketName(name: string) {
    try {
      await this.minioService.client.makeBucket(name, 'us-east-1');
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
  private async uploadFileToBucketName(bucketName: string, file: BufferedFile) {
    if (file !== undefined) {
      try {
        //  file.map(async e=>{
        const metaData = {
          'Content-Type': file.mimetype,
        };
        await this.minioService.client.putObject(
          bucketName,
          file.fileName,
          file.buffer,
          metaData,
        );
        //  })
      } catch (error) {
        Logger.error('uploadFileToBucketName:', error);
      }
    }
  }

  private async DeleteFileToBucketName(bucketName: string, fileName: string) {
    try {
      await this.minioService.client.removeObject(bucketName, fileName);
    } catch (error) {
      Logger.error('uploadFileToBucketName:', error);
    }
  }
  async uploadFile(bucketName: string, fileName: BufferedFile) {
    if (!await this.checkBucket(bucketName)) {
      if (await this.makeBucketName(bucketName)) {
        try {
          await this.uploadFileToBucketName(bucketName, fileName);
          return {
            status: true,
            message: 'upload file success',
          };
        } catch (error) {
          Logger.error('uploadFile:', error);
          return {
            status: false,
            message: new InternalServerErrorException('uploadFile fail.'),
          };
        }
      }
    } else {
      try {
        await this.uploadFileToBucketName(bucketName, fileName);
        return {
          status: true,
          message: 'upload file success',
        };
      } catch (error) {
        Logger.error('uploadFile:', error);
        return {
          status: false,
          message: new InternalServerErrorException('uploadFile fail.'),
        };
      }
    }
  }
  async DeleteFile(bucketName: string, fileName: string) {
    if (await this.checkBucket(bucketName)) {
      try {
        await this.DeleteFileToBucketName(bucketName, fileName);
      } catch (error) {
        Logger.error('DeleteFileToBucketName:', error);
        new InternalServerErrorException('delete fie serivces fail.');
      }
    }
  }
}
