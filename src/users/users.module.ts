import { Module } from '@nestjs/common';
import { PastesModule } from 'src/pastes/pastes.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [PrismaModule, PastesModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
