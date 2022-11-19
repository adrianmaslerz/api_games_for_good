import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { InputCreateTaskDto } from './dto/input.create-task.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OutputTaskDto } from './dto/output.task.dto';
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../../core/guards/roles.guard";
import {Roles} from "../../core/enums/roles.enum";
@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Post()
  @ApiOperation({ description: 'Create tasks' })
  @ApiOkResponse({ description: 'Mission created.', type: OutputTaskDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() input: InputCreateTaskDto) {
    return (await this.tasksService.create(input)).serialize();
  }

  // @UseGuards(new RoleGuard(Roles.ADMIN))
  // @Get()
  // @ApiOperation({ description: 'Get all' })
  // @ApiPaginationResponse({
  //   description: 'Objects returned.',
  //   type: OutputTaskDto,
  // })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  // @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  // findAll(): Promise<OutputPaginationDto<OutputTaskDto>> {
  //   return this.missionService.findAll();
  // }
  //
  // @UseGuards(new RoleGuard(Roles.ADMIN))
  // @Get(':id')
  // @ApiOperation({ description: 'Get by id' })
  // @ApiOkResponse({ description: 'Poop returned.', type: OutputTaskDto })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  // @ApiNotFoundResponse({ description: 'Poop not found.' })
  // findOne(@Param('id') id: number) {
  //   return this.missionService.findOne({ id });
  // }
  //
  // @UseGuards(new RoleGuard(Roles.ADMIN))
  // @Put(':id')
  // @ApiOperation({ description: 'Update tasks' })
  // @ApiOkResponse({ description: 'Mission updated.', type: OutputTaskDto })
  // @ApiBadRequestResponse({ description: 'Validation failed.' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateMissionDto: InputCreateTaskDto,
  // ) {
  //   return (await this.missionService.update(id, updateMissionDto)).serialize();
  // }
  //
  // @UseGuards(new RoleGuard(Roles.ADMIN))
  // @Delete(':id')
  // @ApiOperation({ description: 'Remove tasks' })
  // @ApiOkResponse({ description: 'Mission removed.', type: Boolean })
  // @ApiBadRequestResponse({ description: 'Validation failed.' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  // remove(@Param('id') id: number) {
  //   return this.missionService.remove(id);
  // }
}
