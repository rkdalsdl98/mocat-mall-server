import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerSetting } from './swagger.setting';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.setBaseViewsDir(join(__dirname, '../../', 'views'));
  app.setViewEngine('ejs');
  
  SwaggerSetting(app)
  
  await app.listen(3000);
}
bootstrap();
