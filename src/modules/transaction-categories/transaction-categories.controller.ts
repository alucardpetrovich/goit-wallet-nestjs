import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TransactionCategoriesService } from './transaction-categories.service';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { TransactionCategorySerializer } from './serializers/transaction-category.serializer';

@Controller('transaction-categories')
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(TransactionCategorySerializer))
@ApiTags('Transaction Categories')
@ApiBearerAuth()
export class TransactionCategoriesController {
  constructor(
    private transactionCategoriesService: TransactionCategoriesService,
  ) {}

  @Get()
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Transaction categories returned',
    type: TransactionCategorySerializer,
    isArray: true,
  })
  async getTransactionCategories(): Promise<TransactionCategorySerializer[]> {
    return this.transactionCategoriesService.getTransactionCategories();
  }
}
