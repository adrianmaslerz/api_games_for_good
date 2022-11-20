import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEnum } from 'src/core/utils/validators';
import { TaskCompletionStatus } from '../entity/task-completion.entity';

export class InputSetTaskStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskCompletionStatus)
  status: TaskCompletionStatus;
}
