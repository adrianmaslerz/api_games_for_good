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
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { handleNotFound, pagination } from '../../core/utils/utils';
import { InputCreateMissionDto } from './dto/input.create-mission.dto';
import { OutputMissionDto } from './dto/output.mission.dto';
import { MissionEntity } from './entity/mission.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionRepository: EntityRepository<MissionEntity>,
  ) {}

  async create(data: InputCreateMissionDto) {
    const mission = this.missionRepository.create(data);
    await this.missionRepository.persistAndFlush(mission);
    return mission;
  }

  async findAll(): Promise<OutputPaginationDto<OutputMissionDto>> {
    const query = this.missionRepository.createQueryBuilder('mission');
    const data = await pagination({ limit: 10, offset: 0 }, query, [], {
      default: 'mission.id',
    });
    return data;
  }

  async findOne(filter: FilterQuery<MissionEntity>): Promise<MissionEntity> {
    const mission = await this.missionRepository.findOne(filter);
    handleNotFound('mission', mission);
    return mission;
  }

  async update(id: number, data: InputCreateMissionDto) {
    let mission = await this.missionRepository.findOne({ id });
    handleNotFound('mission', mission);
    mission.updateProperties(data, ['name', 'startDate', 'endDate']);
    await this.missionRepository.flush();
    return mission;
  }

  async remove(id: number) {
    let mission = await this.missionRepository.findOne({ id });
    handleNotFound('mission', mission);
    await this.missionRepository.removeAndFlush(mission);
    return true;
  }

  //for tests
  async truncate() {
    const knex = this.missionRepository.getKnex();
    await knex.from('refresh_token_entity').where(knex.raw('true')).delete('*');
    await knex.from('mission_entity').where(knex.raw('true')).delete('*');
  }
}
