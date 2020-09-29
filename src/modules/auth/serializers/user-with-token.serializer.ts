import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserSerializer } from 'src/modules/users/serializers/user.serializer';

export class UserWithTokenSerializer {
  @ApiProperty()
  @Type(() => UserSerializer)
  user: UserSerializer;

  @ApiProperty()
  token: string;
}
