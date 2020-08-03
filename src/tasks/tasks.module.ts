import { Module } from '@nestjs/common';
import { PastesModule } from 'src/pastes/pastes.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  imports: [PastesModule],
})
export class TasksModule {}
