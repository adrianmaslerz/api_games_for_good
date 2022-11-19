import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/input.create-user.dto';
import { UpdateUserDto } from './dto/input.update-user.dto';
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
import { OutputUserDto } from './dto/output.user.dto';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { RoleGuard } from '../../core/guards/roles.guard';
import { User } from '../../core/decorators/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../core/enums/roles.enum';
import { ApiPaginationResponse } from '../../core/decorators/api-pagination-response.decorator';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { InputSaveFileDto } from 'src/core/dto/input.save-file.dto';
import { FileTypeValidator } from 'src/core/utils/validators';
import { FileTypes } from 'src/core/enums/file-types.enum';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Post()
  @ApiOperation({ description: 'Create user' })
  @ApiOkResponse({ description: 'User created.', type: OutputUserDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return (await this.userService.create(createUserDto)).serialize();
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Get()
  @ApiOperation({ description: 'Get all' })
  @ApiPaginationResponse({ description: 'Objects returned.', type: OutputUserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: ErrorMessages.USER_NOT_FOUND })
  findAll(): Promise<OutputPaginationDto<OutputUserDto>> {
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Get user profile' })
  @ApiOkResponse({ description: 'Object returned.', type: OutputUserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  public me(@User() user: UserEntity): OutputUserDto {
    return user;
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Get(':id')
  @ApiOperation({ description: 'Get by id' })
  @ApiOkResponse({ description: 'Poop returned.', type: OutputUserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Poop not found.' })
  findOne(@Param('id') id: number) {
    return this.userService.findOne({ id });
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Put(':id')
  @ApiOperation({ description: 'Update user' })
  @ApiOkResponse({ description: 'User updated.', type: OutputUserDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(new RoleGuard(Roles.ADMIN))
  @Delete(':id')
  @ApiOperation({ description: 'Remove user' })
  @ApiOkResponse({ description: 'User removed.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
