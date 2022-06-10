import { TypeOrmModule } from "@nestjs/typeorm";

const PG_DB_Config={
   PG: TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_UESRNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      })
}
export default PG_DB_Config