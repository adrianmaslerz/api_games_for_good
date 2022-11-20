import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { RewardsService } from './rewards.service';
import { RoleGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/enums/roles.enum';
import { OutputTaskDto } from '../tasks/dto/output.task.dto';
import { InputCreateRewardDto } from './dto/input.create-reward.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InputSaveFileDto } from '../../core/dto/input.save-file.dto';
import { User } from '../../core/decorators/user.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { ApiPaginationResponse } from '../../core/decorators/api-pagination-response.decorator';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { InputGetTasksDto } from '../tasks/dto/input.get-tasks.dto';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { OutputRewardDto } from './dto/output.reward.dto';
import { InputCreateTaskDto } from '../tasks/dto/input.create-task.dto';
import { InputUpdateRewardDto } from './dto/input.update-reward.dto';
import {SuccessOutputDTO} from "../../core/dto/output.success.dto";

@ApiTags('Rewards')
@Controller('rewards')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @UseGuards(new RoleGuard(Roles.ADMIN))
  @ApiOperation({ description: 'Create reward' })
  @ApiOkResponse({
    description: 'Reward created created.',
    type: OutputTaskDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() input: InputCreateRewardDto) {
    return (await this.rewardsService.create(input)).serialize();
  }

  @Put(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'upload logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'file', type: InputSaveFileDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async uploadProfilePhoto(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<any> {
    return this.rewardsService.addLogo(id, file);
  }

  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({
    description: 'Objects returned.',
    type: OutputRewardDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(): Promise<OutputPaginationDto<OutputRewardDto>> {
    return this.rewardsService.findAll();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Put(':id')
  @ApiOperation({ description: 'Update reward' })
  @ApiOkResponse({ description: 'Reward updated.', type: OutputRewardDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(@Param('id') id: number, @Body() input: InputUpdateRewardDto) {
    return (await this.rewardsService.update(id, input)).serialize();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get by id' })
  @ApiOkResponse({ description: 'Reward returned.', type: OutputTaskDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Reward not found.' })
  findOne(@Param('id') id: number) {
    return this.rewardsService.findOne({ id });
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Delete(':id')
  @ApiOperation({ description: 'Remove reward' })
  @ApiOkResponse({ description: 'Reward removed.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async remove(@Param('id') id: number) {
    await this.rewardsService.remove(id);
    return new SuccessOutputDTO();
  }
}
