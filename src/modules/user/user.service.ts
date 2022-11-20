import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OutputPaginationDto } from 'src/core/dto/output.pagination.dto';
import { FileTypes } from 'src/core/enums/file-types.enum';
import { Roles } from 'src/core/enums/roles.enum';
import { EmailService } from 'src/core/services/email.service';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { handleNotFound, pagination } from '../../core/utils/utils';
import { UploadedFileEntity } from '../upload/entity/uploaded-file.entity';
import { UploadService } from '../upload/upload.service';
import { CreateUserDto } from './dto/input.create-user.dto';
import { UpdateUserDto } from './dto/input.update-user.dto';
import { OutputUserDto } from './dto/output.user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private emailService: EmailService,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateUserDto) {
    let user = await this.userRepository.findOne({ email: data.email });
    if (user) {
      throw new BadRequestException(ErrorMessages.USER_EXISTS);
    }
    user = this.userRepository.create(data);
    await this.userRepository.persistAndFlush(user);
    await this.emailService.welomeUser(data.email, { password: data.password });
    return user;
  }

  async findAll(): Promise<OutputPaginationDto<OutputUserDto>> {
    const query = this.userRepository.createQueryBuilder('user');
    const data = await pagination({ limit: 10, offset: 0 }, query, [], {
      default: 'user.id',
    });
    return data;
  }

  async findOne(filter: FilterQuery<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne(filter, {
      populate: ['profilePhoto'],
    });
    handleNotFound('user', user);
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    user.updateProperties(data, ['password', 'role', 'username']);
    if (!data.password) {
      delete user.password;
    }
    await this.userRepository.flush();
    return user;
  }

  async addProfilePhoto(user: UserEntity, file: Express.Multer.File) {
    const uploadedFile = await this.uploadService.save(
      'profile',
      file,
      FileTypes.IMAGE,
    );
    user.profilePhoto = uploadedFile;
    delete user.password;
    await this.userRepository.flush();
    return user;
  }

  async remove(id: number) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }
    await this.userRepository.removeAndFlush(user);
    return true;
  }

  //for tests
  async truncate() {
    const knex = this.userRepository.getKnex();
    await knex.from('refresh_token_entity').where(knex.raw('true')).delete('*');
    await knex.from('user_entity').where(knex.raw('true')).delete('*');
  }
}
