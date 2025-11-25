import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true, // Allow all origins for now
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Properly handle Prisma shutdown
  const prismaService = app.get(PrismaService);
  
  process.on('beforeExit', async () => {
    await prismaService.$disconnect();
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();