import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserEntity } from '../../modules/user/entity/user.entity';
import { InputLoginDto } from '../../modules/auth/dto/input.login.dto';

import { OutputAuthTokensDto } from '../../modules/auth/dto/output.auth-token.dto';
import { TaskCompletionService } from './task-completion.service';
import { User } from 'src/core/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { InputCompleteTaskDto } from './dto/input.complete-task.dto';

@ApiTags('task-completion')
@Controller('task-completion')
@UseGuards(AuthGuard())
export class AuthController {
  constructor(private readonly taskCompletionService: TaskCompletionService) {}

  @Post('complete')
  @ApiOperation({ description: 'complete task' })
  @ApiCreatedResponse({
    description: 'Object returned.',
    type: OutputAuthTokensDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async completeTask(
    @User() user: UserEntity,
    @Body() data: InputCompleteTaskDto,
  ): Promise<any> {
    return await this.taskCompletionService.completeTask(user, {
      id: data.taskId,
    });
  }
}
