import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { UploadedFileEntity } from './src/modules/upload/entity/uploaded-file.entity';
import { IEnvironments } from './src/config/environments';
import { PasswordTokenEntity } from './src/modules/auth/entity/password-token.entity';
import { RefreshTokenEntity } from './src/modules/auth/entity/refresh-token.entity';
import { UserEntity } from './src/modules/user/entity/user.entity';

const cs: ConfigService<IEnvironments> = new ConfigService();

//for api
export const MikroOrmConfigFn: (
  configService: ConfigService<IEnvironments>,
  test?: boolean,
) => Options = (configService = cs as any, test = false) => ({
  type: 'postgresql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  user: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  dbName: configService.get<string>('DATABASE_NAME'),
  entities: [
    UserEntity,
    RefreshTokenEntity,
    PasswordTokenEntity,
    UploadedFileEntity,
  ],
  allowGlobalContext: true,
  migrations: { disableForeignKeys: false },
  driverOptions: {
    ...(process.env.NODE_ENV === 'production' && {
      connection: { ssl: { rejectUnauthorized: false } },
    }),
  },
});

//for cli
const MikroOrmConfig: Options = MikroOrmConfigFn(cs);

export default MikroOrmConfig;
