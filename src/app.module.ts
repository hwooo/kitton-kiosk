import './env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@common/guard/jwt.guard';
import { RolesGuard } from '@common/guard/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ProductModule } from '@product/product.module';
import { SettleModule } from '@settle/settle.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
