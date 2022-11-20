import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { SharedModule } from '../shared.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PassportModule } from '@nestjs/passport';
import { RewardEntity } from './entity/reward.entity';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature({ entities: [RewardEntity] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
