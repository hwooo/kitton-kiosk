import 'reflect-metadata';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import './src/env';

export const DATABASE_CONFIG: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  extra: {
    connectionLimit: +process.env.MAX_CONNECTION_LIMIT || 10,
  },
};
