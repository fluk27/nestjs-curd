import {
  Injectable,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Repository, Connection, In } from 'typeorm';
import { FilesNews } from './entities/file.entity';
import { BufferedFile } from '../helpers/minio/file.model';
import { HelpersMinioService } from '../helpers/minio/minio.service';
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newRepo: Repository<News>,
    @InjectRepository(FilesNews)
    private fileRepo: Repository<FilesNews>,
    private readonly connection: Connection,
    private readonly HMS: HelpersMinioService,
  ) {}
  async create(createNewsDto: CreateNewsDto, fileNameNews: BufferedFile[]) {
    let { subtitle, detail } = createNewsDto;
    if (subtitle === undefined) {
      subtitle = detail.length >= 20 ? detail.slice(0, 20) : detail;
    }

    const queryrunner = this.connection.createQueryRunner();
    await queryrunner.connect();
    await queryrunner.startTransaction();
    const datas = {
      title: createNewsDto.title,
      subtitle: subtitle,
      detail: detail,
      publish_at_start: createNewsDto.publish_at_start,
      publish_at_end: createNewsDto.publish_at_end,
      isPublish:
        typeof createNewsDto.isPublish === 'string'
          ? Boolean(createNewsDto.isPublish)
          : createNewsDto.isPublish,
    };
    try {
      const resultStore = await queryrunner.manager.save(News, datas);
      await queryrunner.commitTransaction();
      if (fileNameNews.length > 0) {
        fileNameNews.map(async (e) => {
          e.fileName = `${new Date().getTime()}-${e.originalname}`;
          await this.fileRepo.save({
            fileName: e.fileName,
            news: resultStore,
          });
          await this.HMS.uploadFile('news', e);
        });
      }
      return resultStore;
    } catch (error) {
      await queryrunner.rollbackTransaction();
    } finally {
      await queryrunner.release();
    }
  }

  async findAll() {
    return await this.newRepo.find({ relations: ['files'] });
  }

  async findOne(id: number) {
    return await this.newRepo.findOne({ where: { id }, relations: ['files'] });
  }

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    fileNameNews: BufferedFile[],
  ) {
    const resultNews = await this.newRepo.findOne({ where: { id } });
    if (resultNews) {
      const qr = this.connection.createQueryRunner();

      let { subtitle, detail } = updateNewsDto;
      if (subtitle === undefined) {
        subtitle = detail.length >= 20 ? detail.slice(0, 20) : detail;
      }
      const datas = {
        id: resultNews.id,
        title: updateNewsDto.title,
        subtitle: subtitle,
        detail: detail,
        publish_at_start: updateNewsDto.publish_at_start,
        publish_at_end: updateNewsDto.publish_at_end,
        isPublish:
          typeof updateNewsDto.isPublish === 'string'
            ? Boolean(updateNewsDto.isPublish)
            : updateNewsDto.isPublish,
      };
      try {
        await qr.connect();
        await qr.startTransaction();
        const resultEdit = await qr.manager.save(News, datas);
        await qr.commitTransaction();
        if (updateNewsDto.oldFilesId !== undefined) {
          updateNewsDto.oldFilesId.map((e) => {
            Number(e);
          });
          const resultFile = await this.fileRepo
            .createQueryBuilder('file')
            .where('file.Id IN(:...id)', { id: updateNewsDto.oldFilesId })
            .getMany();
          if (resultFile) {
            resultFile.map(async (e) => {
              await this.HMS.DeleteFile('news', e.fileName);
            });
            //  resultFile.map(async (e)=>{
            await this.fileRepo.remove(resultFile);
            //  })
          }
        }

        if (fileNameNews.length > 0) {
          fileNameNews.map(async (e) => {
            fileNameNews.map(async (e) => {
              e.fileName = `${new Date().getTime()}-${e.originalname}`;
              await this.fileRepo.save({
                fileName: e.fileName,
                news: resultEdit,
              });
              await this.HMS.uploadFile('news', e);
            });
          });
        }

        return resultEdit;
      } catch (error) {
        await qr.rollbackTransaction();
      } finally {
        await qr.release();
      }
    } else {
      throw new NotFoundException(`data new id ${id} empty.`);
    }
  }

  async remove(id: number) {
    const resultNews = await this.newRepo.findOne({
      where: { id },
      relations: ['files'],
    });
    if (resultNews) {
      const qr = this.connection.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      try {
        await qr.manager.delete(News, id);
        await qr.commitTransaction();
      } catch (error) {
        console.error('error:', error.toString());

        await qr.rollbackTransaction();
      } finally {
        await qr.release();
        if (resultNews.files.length > 0) {
          resultNews.files.map(async (e) => {
            await this.HMS.DeleteFile('news', e.fileName);
          });
        }
      }
    } else {
      throw new NotFoundException(`data new id ${id} empty.`);
    }
  }
}
