import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TaskCompletionService } from '../tasks/task-completion.service';
import { RoleGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/enums/roles.enum';
import { OutputTaskDto } from '../tasks/dto/output.task.dto';
import { InputCreateTaskDto } from '../tasks/dto/input.create-task.dto';
import { CommentsService } from './comments.service';
import { InputCreateCommentDto } from './dto/input.create-comment.dto';
import { User } from '../../core/decorators/user.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { ApiPaginationResponse } from '../../core/decorators/api-pagination-response.decorator';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { InputGetTasksDto } from '../tasks/dto/input.get-tasks.dto';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { OutputCommentDto } from './dto/output.comment.dto';
import { InputGetCommentsDto } from './dto/input.get-comments.dto';

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class CommentsController {
  constructor(
    private readonly taskCompletionService: TaskCompletionService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create comment' })
  @ApiOkResponse({ description: 'Comment created.', type: OutputTaskDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() input: InputCreateCommentDto, @User() user: UserEntity) {
    const taskCompletion = await this.taskCompletionService.findOne({
      id: parseInt(input.taskCompletion),
    });
    return (
      await this.commentsService.create(input, user, taskCompletion)
    ).serialize();
  }

  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputCommentDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(
    @Query() query: InputGetCommentsDto,
  ): Promise<OutputPaginationDto<OutputCommentDto>> {
    return this.commentsService.findAll(query);
  }
}
