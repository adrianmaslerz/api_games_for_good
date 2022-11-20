import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UploadService } from '../upload/upload.service';
import { RewardEntity } from './entity/reward.entity';
import { InputCreateRewardDto } from './dto/input.create-reward.dto';
import { FileTypes } from '../../core/enums/file-types.enum';
import { FilterQuery } from '@mikro-orm/core';
import { handleNotFound, pagination } from '../../core/utils/utils';
import {InputUpdateRewardDto} from "./dto/input.update-reward.dto";

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardsRepository: EntityRepository<RewardEntity>,
    private uploadService: UploadService,
  ) {}

  async create(data: InputCreateRewardDto) {
    const reward = this.rewardsRepository.create(data);
    await this.rewardsRepository.persistAndFlush(reward);
    return reward;
  }

  async findOne(
    filter: FilterQuery<RewardEntity>,
    handleNotFoundError = true,
  ): Promise<RewardEntity> {
    const reward = await this.rewardsRepository.findOne(filter);
    if (handleNotFoundError) {
      handleNotFound('rewards', reward);
    }
    return reward;
  }

  async addLogo(id: number, file: Express.Multer.File) {
    const task = await this.findOne({ id });
    const uploadedFile = await this.uploadService.save(
      'rewards',
      file,
      FileTypes.IMAGE,
    );
    task.logo = uploadedFile;

    await this.rewardsRepository.flush();
    return task;
  }

  async findAll(): Promise<any> {
    const query = this.rewardsRepository.createQueryBuilder('r');
    return await query.execute();
  }

  async update(id: number, data: InputUpdateRewardDto) {
    const reward = await this.rewardsRepository.findOne({ id });
    handleNotFound('rewards', reward);
    reward.updateProperties(
        data,
        [
          'name',
          'description',
          'points',
        ],
    );
    await this.rewardsRepository.flush();
    return reward;
  }

  async remove(id: number) {
    const reward = await this.rewardsRepository.findOne({ id });
    handleNotFound('rewards', reward);
    await this.rewardsRepository.removeAndFlush(reward);
    return true;
  }
}
