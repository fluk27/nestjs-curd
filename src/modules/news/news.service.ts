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
import { Repository, Connection } from 'typeorm';
import { FilesNews } from './entities/file.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newRepo: Repository<News>,
    @InjectRepository(FilesNews)
    private fileRepo: Repository<FilesNews>,
    private readonly connection: Connection,
  ) {}
  async create(createNewsDto: CreateNewsDto, fileNameNews: string[]) {
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
      if (fileNameNews.length > 0) {
        fileNameNews.map(async (e) => {
          await this.fileRepo.save({
            fileName: e,
            news: resultStore,
          });
        });
      }
      await queryrunner.commitTransaction();
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
    FileNameNews: string[],
  ) {
    const resultNews = await this.newRepo.findOne({ where: { id } });
    if (resultNews) {
      const qr = await this.connection.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
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
        const resultEdit = await qr.manager.save(News, datas);
        if (FileNameNews.length > 0) {
          const resultFile = await this.fileRepo.findOne({
            where: { id: resultEdit.id },
          });
          if (resultFile) {
          await  this.fileRepo
              .createQueryBuilder('file')
              .delete()
              .where('file.newsId=:id', { id : resultEdit.id }).execute()
              FileNameNews.map(async (e) => {
                await this.fileRepo.save({
                  fileName: e,
                  news: resultEdit,
                });
              });
          } else {
            FileNameNews.map(async (e) => {
              await this.fileRepo.save({
                fileName: e,
                news: resultEdit,
              });
            });
          }
        }
        await qr.commitTransaction();
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
    const resultNews = await this.newRepo.findOne({ where: { id } });
    console.log('====================================');
    console.log('resultNews:', resultNews);
    console.log('====================================');
    if (resultNews) {
      const qr = this.connection.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      try {
        await qr.manager.delete(News, id);
        await qr.commitTransaction();
      } catch (error) {
        Logger.error(error);
        await qr.rollbackTransaction();
      } finally {
        await qr.release();
      }
    } else {
      throw new NotFoundException(`data new id ${id} empty.`);
    }
  }
}
