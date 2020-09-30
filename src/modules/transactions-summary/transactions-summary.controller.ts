import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsSummaryService } from './transactions-summary.service';
import { GetTransactionSummaryQueryDto } from './dto/get-transaction-summary-query.dto';
import { DUser } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';

@Controller('transactions-summary')
@UseGuards(BearerGuard)
@ApiTags('Transaction Summary Controller')
@ApiBearerAuth()
export class TransactionsSummaryController {
  constructor(private transactionsSummaryService: TransactionsSummaryService) {}

  @Get()
  async getTransactionsSummary(
    @DUser() user: UserEntity,
    @Query() getTransactionSummaryQueryDto: GetTransactionSummaryQueryDto,
  ): Promise<any> {
    return this.transactionsSummaryService.aggregateTransactionsSummary(
      getTransactionSummaryQueryDto,
      user,
    );
  }
}
