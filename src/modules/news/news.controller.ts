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
import { FileImagesInterceptor } from '../../file-images.interceptor';
import { imagefilter } from './images.filter';
// 20 mb
const Filesize:number=1048576*20
const maxcount:number= 3
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Post()
  @UseInterceptors(
    FilesInterceptor('images',maxcount, {
      fileFilter: imagefilter,
      limits: { fieldSize: Filesize },
    }),
  )
  create(
    @Req() req: any,
    @UploadedFiles() files,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    // if (req.fileValidationError) {
    //   throw new BadRequestException(' file type images only.')
    // }
    let filename: string[] = [];
    if (files.length > 0) {
      files.map((e) => {
        filename.push(e.filename);
      });
    }
    return this.newsService.create(createNewsDto, filename);
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
    @UploadedFiles() files,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    let filename: string[] = [];
    if (files.length > 0) {
      files.map((e) => {
        filename.push(e.filename);
      });
    }
    return this.newsService.update(+id, updateNewsDto, filename);
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
