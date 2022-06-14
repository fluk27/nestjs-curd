import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Put,
  HttpCode,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HttpStatus } from '@nestjs/common';
import { imagefilter } from './images.filter';
import { HelpersMinioService } from '../helpers/minio/minio.service';
import { BufferedFile } from '../helpers/minio/file.model';
// 20 mb
const Filesize:number=1048576*20
const maxcount:number= 3
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService,
    private readonly HMS:HelpersMinioService) {}
  @Post()
  @UseInterceptors(
    FilesInterceptor('images',maxcount, {
      fileFilter: imagefilter,
      limits: { fieldSize: Filesize },
    }),
  )
  create(
    @UploadedFiles() files:BufferedFile[],
    @Body() createNewsDto: CreateNewsDto,
  ) {

     return this.newsService.create(createNewsDto, files);
        
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 20))
  update(
    @Param('id') id: string,
    @UploadedFiles() files:BufferedFile[],
    @Body() updateNewsDto: UpdateNewsDto,
  ) {

    return this.newsService.update(+id, updateNewsDto, files);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!isNaN(parseInt(id))) {
      return this.newsService.remove(parseInt(id));
    } else {
      throw new BadRequestException('id Is numberic only.');
    }
  }
}
