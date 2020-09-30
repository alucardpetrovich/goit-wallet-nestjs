import {
  Controller,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TransactionsSummaryService } from './transactions-summary.service';
import { GetTransactionSummaryQueryDto } from './dto/get-transaction-summary-query.dto';
import { DUser } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { TransactionsSummarySerializer } from './serializers/transactions-summary.serializer';

@Controller('transactions-summary')
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(TransactionsSummarySerializer))
@ApiTags('Transaction Summary Controller')
@ApiBearerAuth()
export class TransactionsSummaryController {
  constructor(private transactionsSummaryService: TransactionsSummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get transactions summary for period' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Transaction summary returned',
    type: TransactionsSummarySerializer,
  })
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
