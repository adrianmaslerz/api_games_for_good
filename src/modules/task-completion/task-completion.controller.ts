import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  UploadedFiles,
  Query,
  Put,
} from '@nestjs/common';
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

import { UserEntity } from '../../modules/user/entity/user.entity';
import { InputLoginDto } from '../../modules/auth/dto/input.login.dto';

import { OutputAuthTokensDto } from '../../modules/auth/dto/output.auth-token.dto';
import { TaskCompletionService } from './task-completion.service';
import { User } from 'src/core/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { InputIdDto } from 'src/core/dto/input.id.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { InputSaveFileDto } from 'src/core/dto/input.save-file.dto';
import { FileTypes } from 'src/core/enums/file-types.enum';
import { RoleGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/enums/roles.enum';
import { ApiPaginationResponse } from 'src/core/decorators/api-pagination-response.decorator';
import { ErrorMessages } from 'src/core/enums/error-messages.enum';
import { OutputPaginationDto } from 'src/core/dto/output.pagination.dto';
import { OutputUserDto } from '../user/dto/output.user.dto';
import { OutputTaskCompletionDto } from './dto/output.task-completion.dto';
import { InputSaveFilesDto } from 'src/core/dto/input.save-files.dto';
import { InputPaginationDto } from 'src/core/dto/input.pagination.dto';
import { InputUpdateTaskCompletionDto } from './dto/input.update-task-completion.dto';

@ApiTags('task-completion')
@Controller('task-completion')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TaskCompletionController {
  constructor(private readonly taskCompletionService: TaskCompletionService) {}

  @Post('complete-task/:id')
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
  ): Promise<any> {
    return (
      await this.taskCompletionService.completeTask(user, { id }, files)
    ).serialize();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputTaskCompletionDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(
    @Query() query: InputPaginationDto,
  ): Promise<OutputPaginationDto<OutputUserDto>> {
    return this.taskCompletionService.findAll(query);
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Put(':id/rate')
  @ApiOperation({ description: 'Rate' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputTaskCompletionDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  async rate(
    @Param('id') id: number,
    @Body() data: InputUpdateTaskCompletionDto,
  ): Promise<OutputTaskCompletionDto> {
    console.log(data);
    return (await this.taskCompletionService.update(id, data)).serialize();
  }
}
