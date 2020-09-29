import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserSerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  passwordHash: string;

  @ApiProperty()
  balance: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
