import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  app.use(cookieParser(process.env.cookie_secrete))

  const config = new DocumentBuilder()
    .setTitle('Penclub API')
    .setDescription('API documentation for Penclub backend')
    .setVersion('1.0')
    .addBearerAuth() // if using JWT later
    .build();


  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 5000;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger running on http://localhost:${port}/api/docs`);
}
bootstrap();
