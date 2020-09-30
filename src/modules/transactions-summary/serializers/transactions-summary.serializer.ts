import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';
import { Type } from 'class-transformer';

export class CategorySummarySerializer {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: TransactionTypes })
  type: string;

  @ApiProperty()
  total: number;
}

export class TransactionsSummarySerializer {
  @ApiProperty({ type: CategorySummarySerializer, isArray: true })
  @Type(() => CategorySummarySerializer)
  categoriesSummary: CategorySummarySerializer[];

  @ApiProperty()
  incomeSummary: number;

  @ApiProperty()
  expenseSummary: number;

  @ApiProperty()
  periodTotal: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;
}
