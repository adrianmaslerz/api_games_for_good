import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Param,
  Put,
  Delete,
  Query,
  UploadedFiles,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { InputCreateTaskDto } from './dto/input.create-task.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OutputTaskDto } from './dto/output.task.dto';
import { RoleGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginationResponse } from '../../core/decorators/api-pagination-response.decorator';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { InputGetTasksDto } from './dto/input.get-tasks.dto';
import { SuccessOutputDTO } from '../../core/dto/output.success.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InputSaveFilesDto } from '../../core/dto/input.save-files.dto';
import { OutputAuthTokensDto } from '../auth/dto/output.auth-token.dto';
import { User } from '../../core/decorators/user.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { InputCompleteTaskDto } from './dto/input.complete-task.dto';
import {TaskCompletionService} from "./task-completion.service";

@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskCompletionService: TaskCompletionService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(Roles.ADMIN))
  @ApiOperation({ description: 'Create tasks' })
  @ApiOkResponse({ description: 'Mission created.', type: OutputTaskDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() input: InputCreateTaskDto) {
    return (await this.tasksService.create(input)).serialize();
  }

  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputTaskDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(
    @Query() query: InputGetTasksDto,
  ): Promise<OutputPaginationDto<OutputTaskDto>> {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get by id' })
  @ApiOkResponse({ description: 'Poop returned.', type: OutputTaskDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Poop not found.' })
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne({ id });
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Put(':id')
  @ApiOperation({ description: 'Update tasks' })
  @ApiOkResponse({ description: 'Mission updated.', type: OutputTaskDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(
    @Param('id') id: number,
    @Body() updateMissionDto: InputCreateTaskDto,
  ) {
    return (await this.tasksService.update(id, updateMissionDto)).serialize();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Delete(':id')
  @ApiOperation({ description: 'Remove tasks' })
  @ApiOkResponse({ description: 'Mission removed.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async remove(@Param('id') id: number) {
    await this.tasksService.remove(id);
    return new SuccessOutputDTO();
  }

  @Post(':id/complete')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ description: 'complete task' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'files', type: InputSaveFilesDto })
  @ApiCreatedResponse({
    description: 'Object returned.',
    type: OutputAuthTokensDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async completeTask(
    @User() user: UserEntity,
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() input: InputCompleteTaskDto,
  ): Promise<any> {
    const task = await this.tasksService.findOne({ id });

    const hasSubtasks = await this.tasksService.findOne({ parent: id }, false);
    if (hasSubtasks && !task.recurring) {
      throw new ConflictException("You can't complete this task without ");
    }
    const exists = await this.taskCompletionService.findOne(
      { task, user },
      false,
    );
    if (exists) {
      throw new ConflictException('Task already completed');
    }

    return (
      await this.taskCompletionService.completeTask(user, task, files, input)
    ).serialize();
  }
}
