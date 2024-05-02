import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./users/users.module";
import { ConfigModule } from '@nestjs/config';

//host: hostname,
//port: parseInt(pg.port),
//username: pg.username,
//password: pg.password,
//database: pg.pathname.slice(1),
//ssl: pg.searchParams.get('sslmode') !== 'disable',

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.APP_PG_URL,
      autoLoadEntities: true,
      // it is unsafe to use synchronize: true for schema synchronization on production
      synchronize: false, // process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      useUTC: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
