import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { IEnvironments } from 'src/config/environments';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService<IEnvironments> = app.get(ConfigService);

  // generate REST API documentation
  const documentation = new DocumentBuilder()
    .setTitle('Hackathon api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(app, documentation),
  );

  // validate DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // dont show exluded fields in response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // security middlewares
  app.enableCors();

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
