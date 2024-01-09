import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  await app.listen(3089, '0.0.0.0', () => {
    console.log('Node.js server is listening');
  });
}
bootstrap();
