import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmConfigFn } from 'mikro-orm.config';
import { environments, IEnvironments } from './config/environments';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UserModule } from './modules/user/user.module';
import {CommentsModule} from "./modules/comments/comments.module";
import {RewardsModule} from "./modules/rewards/rewards.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [environments],
    }),

    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IEnvironments>) => ({
        ...MikroOrmConfigFn(configService),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    AuthModule,
    UserModule,
    TasksModule,
    SharedModule,
    CommentsModule,
    RewardsModule
  ],
})
export class AppModule {}
