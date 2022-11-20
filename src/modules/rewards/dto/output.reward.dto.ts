import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OutputRewardDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  points: number;

  @ApiProperty({
    nullable: true,
  })
  logo: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
