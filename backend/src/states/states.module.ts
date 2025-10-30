import { Module } from '@nestjs/common';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService],
})
export class StatesModule {}