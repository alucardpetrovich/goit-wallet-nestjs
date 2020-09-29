import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { TransactionSerializer } from './serializers/transaction.serializer';
import { TransactionsService } from './transactions.service';
import { DUser } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';

@Controller('transactions')
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(TransactionSerializer))
@ApiTags('Transactions Controller')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new transaction for logged in user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Bearer authorization failed' })
  @ApiNotFoundResponse({ description: 'Transaction category not found' })
  @ApiConflictResponse({
    description: 'Transaction category type does not match transaction type',
  })
  @ApiCreatedResponse({
    description: 'Transaction created',
    type: TransactionSerializer,
  })
  async createTransaction(
    @DUser() user: UserEntity,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionSerializer> {
    return this.transactionsService.createTransaction(
      createTransactionDto,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for logged in user' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Bearer authorization failed' })
  @ApiOkResponse({
    description: 'Transactions returned',
    type: TransactionSerializer,
    isArray: true,
  })
  async getTransactions(
    @DUser() user: UserEntity,
  ): Promise<TransactionSerializer[]> {
    return this.transactionsService.getTransactions(user);
  }

  @Patch(':transactionId')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Bearer authorization failed' })
  @ApiNotFoundResponse({
    description: 'Transaction or transaction category not found',
  })
  @ApiForbiddenResponse({ description: 'User does not owns transaction' })
  @ApiOkResponse({
    description: 'Transaction updated',
    type: TransactionSerializer,
  })
  async updateTransaction(
    @DUser() user: UserEntity,
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionSerializer> {
    return this.transactionsService.updateTransaction(
      transactionId,
      updateTransactionDto,
      user,
    );
  }

  @Delete(':transactionId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove transaction' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Bearer authorization failed' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiForbiddenResponse({ description: 'User does not owns transaction' })
  @ApiNoContentResponse({ description: 'Transaction deleted' })
  async deleteTransaction(
    @DUser() user: UserEntity,
    @Param('transactionId') transactionId: string,
  ): Promise<void> {
    return this.transactionsService.deleteTransaction(transactionId, user);
  }
}
