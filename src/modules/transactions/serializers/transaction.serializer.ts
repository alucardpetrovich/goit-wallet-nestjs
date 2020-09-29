import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';
import { Exclude } from 'class-transformer';
import { TransactionCategoryEntity } from 'src/modules/transaction-categories/transaction-category.entity';
import { UserEntity } from 'src/modules/users/user.entity';

export class TransactionSerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionDate: string;

  @ApiProperty({ enum: TransactionTypes })
  type: TransactionTypes;

  @Exclude()
  category: TransactionCategoryEntity;

  @ApiProperty()
  categoryId: string;

  @Exclude()
  user: UserEntity;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  balanceAfter: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
