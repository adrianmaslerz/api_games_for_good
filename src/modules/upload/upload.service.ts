import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironments } from 'src/config/environments';
import { ErrorMessages } from 'src/core/enums/error-messages.enum';
import { S3, config } from 'aws-sdk';
import { UploadedFileEntity } from './entity/uploaded-file.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { FileTypes } from 'src/core/enums/file-types.enum';

@Injectable()
export class UploadService {
  private s3: S3;

  constructor(
    private configService: ConfigService<IEnvironments>,
    @InjectRepository(UploadedFileEntity)
    private readonly uploadedFileRepository: EntityRepository<UploadedFileEntity>,
  ) {
    config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
    this.s3 = new S3({
      endpoint: this.configService.get('AWS_S3_BUCKET_ENDPOINT'),
    });
  }

  public async save(
    folder: string,
    file: Express.Multer.File,
    type: FileTypes,
  ): Promise<UploadedFileEntity> {
    const path = folder
      ? `${folder}/${new Date().getTime()}-${file.originalname}`
      : `${new Date().getTime()}-${file.originalname}`;
    await this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: file.buffer,
        Key: path,
        ACL: 'public-read',
      })
      .promise()
      .catch(() => {
        throw new BadRequestException(ErrorMessages.FILE_UPLOAD_FAILED);
      });
    const uploadedFile = this.uploadedFileRepository.create({
      url: path,
      type,
    });
    await this.uploadedFileRepository.persistAndFlush(uploadedFile);
    return uploadedFile;
  }

  public async remove(file: UploadedFileEntity): Promise<boolean> {
    if (file.url) {
      await this.s3
        .deleteObject({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: file.url,
        })
        .promise()
        .catch(() => {
          throw new BadRequestException(ErrorMessages.FILE_REMOVE_FAILED);
        });
    }
    await this.uploadedFileRepository.removeAndFlush(file);
    return true;
  }
}
