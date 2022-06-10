import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from '../modules/tasks/tasks.module';
import { NewsModule } from 'src/modules/news/news.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_UESRNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, './upload')
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null,uniqueSuffix+file.originalname)
        }
      })
    }),
    UsersModule,AuthModule,TasksModule,NewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[MulterModule]
})
export class AppModule {}
