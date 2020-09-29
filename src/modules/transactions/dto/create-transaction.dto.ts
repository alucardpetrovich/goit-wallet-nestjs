import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsISO8601,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsISO8601()
  transactionDate: string;

  @ApiProperty({ enum: TransactionTypes })
  @IsEnum(TransactionTypes)
  type: TransactionTypes;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
