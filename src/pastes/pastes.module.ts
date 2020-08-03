import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PastesService } from './pastes.service';
import { PastesController } from './pastes.controller';

@Module({
  providers: [PastesService],
  imports: [PrismaModule],
  exports: [PastesService],
  controllers: [PastesController],
})
export class PastesModule {}
