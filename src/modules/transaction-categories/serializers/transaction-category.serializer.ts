import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';
import { Exclude } from 'class-transformer';

export class TransactionCategorySerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: TransactionTypes })
  type: TransactionTypes;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
