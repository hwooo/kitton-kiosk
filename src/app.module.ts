import './env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@common/guard/jwt.guard';
import { RolesGuard } from '@common/guard/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ProductModule } from '@product/product.module';
import { SettleModule } from '@settle/settle.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT || 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        synchronize: false,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        extra: {
          connectionLimit: +process.env.MAX_CONNECTION_LIMIT || 10,
        },
      }),
      dataSourceFactory: async (options) => {
        const dataSource = addTransactionalDataSource({
          dataSource: new DataSource(options),
          patch: true,
        });
        return dataSource;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD')
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProductModule,
    SettleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
