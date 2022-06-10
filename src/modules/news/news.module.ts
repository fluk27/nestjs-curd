import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { FilesNews } from './entities/file.entity';

@Module({
  imports:[TypeOrmModule.forFeature([News,FilesNews])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
