import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery, FindOneOptions } from '@mikro-orm/core';
import { handleNotFound, pagination } from '../../core/utils/utils';
import { RewardRedeemEntity } from './entity/reward-redeem.entity';
import {UserEntity} from "../user/entity/user.entity";
import {TaskEntity} from "../tasks/entity/task.entity";
import {InputCompleteTaskDto} from "../tasks/dto/input.complete-task.dto";
import {TaskCompletionStatus} from "../tasks/entity/task-completion.entity";
import {FileTypes} from "../../core/enums/file-types.enum";
import {RewardEntity} from "./entity/reward.entity";

@Injectable()
export class RewardsRedeemService {
  constructor(
    @InjectRepository(RewardRedeemEntity)
    private readonly rewardsRedeemRepository: EntityRepository<RewardRedeemEntity>,
  ) {}

  async findOne(
    filter: FilterQuery<RewardRedeemEntity>,
    handleNotFoundError = true,
    options?: FindOneOptions<RewardRedeemEntity>,
  ): Promise<RewardRedeemEntity> {
    const redeem = await this.rewardsRedeemRepository.findOne(filter, options);
    if (handleNotFoundError) {
      handleNotFound('reward redeem', redeem);
    }
    return redeem;
  }

  public async redeemReward(
      user: UserEntity,
      reward: RewardEntity
  ) {
    const result = this.rewardsRedeemRepository.create({
      user,
      reward,
      points: reward.points,
    });
    await this.rewardsRedeemRepository.persistAndFlush(result);
    return result;
  }
}
