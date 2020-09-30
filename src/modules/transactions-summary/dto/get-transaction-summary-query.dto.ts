import { ApiProperty } from '@nestjs/swagger';
import { Max, Min, IsInt, IsOptional, ValidateIf } from 'class-validator';

export class GetTransactionSummaryQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Max(12)
  @Min(1)
  month: number;

  @ApiProperty({ required: false })
  @ValidateIf(obj => obj.month || obj.year)
  @IsInt()
  @Min(1)
  year: number;
}
