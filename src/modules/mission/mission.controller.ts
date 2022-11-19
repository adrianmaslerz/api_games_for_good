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
import { MissionService } from './mission.service';
import { InputCreateMissionDto } from './dto/input.create-mission.dto';

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
import { OutputMissionDto } from './dto/output.mission.dto';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { RoleGuard } from '../../core/guards/roles.guard';
import { User } from '../../core/decorators/user.decorator';
import { MissionEntity } from './entity/mission.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../core/enums/roles.enum';
import { ApiPaginationResponse } from '../../core/decorators/api-pagination-response.decorator';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { InputSaveFileDto } from 'src/core/dto/input.save-file.dto';
import { FileTypeValidator } from 'src/core/utils/validators';
import { FileTypes } from 'src/core/enums/file-types.enum';

@ApiTags('mission')
@Controller('mission')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Post()
  @ApiOperation({ description: 'Create mission' })
  @ApiOkResponse({ description: 'Mission created.', type: OutputMissionDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() createMissionDto: InputCreateMissionDto) {
    return (await this.missionService.create(createMissionDto)).serialize();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputMissionDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(): Promise<OutputPaginationDto<OutputMissionDto>> {
    return this.missionService.findAll();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Get(':id')
  @ApiOperation({ description: 'Get by id' })
  @ApiOkResponse({ description: 'Poop returned.', type: OutputMissionDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Poop not found.' })
  findOne(@Param('id') id: number) {
    return this.missionService.findOne({ id });
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Put(':id')
  @ApiOperation({ description: 'Update mission' })
  @ApiOkResponse({ description: 'Mission updated.', type: OutputMissionDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(
    @Param('id') id: number,
    @Body() updateMissionDto: InputCreateMissionDto,
  ) {
    return (await this.missionService.update(id, updateMissionDto)).serialize();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Delete(':id')
  @ApiOperation({ description: 'Remove mission' })
  @ApiOkResponse({ description: 'Mission removed.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  remove(@Param('id') id: number) {
    return this.missionService.remove(id);
  }
}
