import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserEntity } from '../users/user.entity';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
    private transactionCategoriesService: TransactionCategoriesService,
    private usersService: UsersService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: UserEntity,
  ): Promise<TransactionEntity> {
    const { categoryId, amount, type } = createTransactionDto;

    const transactionCategory = await this.transactionCategoriesService.getTransactionCategoryById(
      categoryId,
    );

    if (!transactionCategory) {
      throw new NotFoundException(
        `Transaction category with id ${categoryId} not found`,
      );
    }
    if (transactionCategory.type !== type) {
      throw new ConflictException(
        `Transaction type does not correspond to transaction category type`,
      );
    }

    const updatedUser = await this.usersService.updateUserBalance(user, amount);

    return this.transactionsRepository.save({
      ...createTransactionDto,
      category: { id: categoryId },
      user,
      balanceAfter: updatedUser.balance,
    });
  }

  async getTransactions(user: UserEntity): Promise<TransactionEntity[]> {
    return this.transactionsRepository.find({ user });
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
    user: UserEntity,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsRepository.findOne(
      transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }
    if (transaction.userId !== user.id) {
      throw new ForbiddenException(`User does not owns transaction`);
    }

    if (updateTransactionDto.categoryId) {
      const transactionCategory = await this.transactionCategoriesService.getTransactionCategoryById(
        updateTransactionDto.categoryId,
      );

      if (!transactionCategory) {
        throw new NotFoundException(
          `Transaction category with id ${updateTransactionDto.categoryId} not found`,
        );
      }
    }

    const amountDiff = (updateTransactionDto.amount || 0) - transaction.amount;
    if (amountDiff) {
      await this.usersService.updateUserBalance(user, amountDiff);
    }

    const transactionToUpdate = this.transactionsRepository.merge(transaction, {
      ...updateTransactionDto,
      category: {
        id: updateTransactionDto.categoryId && transaction.categoryId,
      },
      balanceAfter: transaction.amount - amountDiff,
    });

    return this.transactionsRepository.save(transactionToUpdate);
  }

  async deleteTransaction(
    transactionId: string,
    user: UserEntity,
  ): Promise<void> {
    const transaction = await this.transactionsRepository.findOne(
      transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }
    if (transaction.userId !== user.id) {
      throw new ForbiddenException(`User does not owns transaction`);
    }

    await this.usersService.updateUserBalance(user, 0 - transaction.amount);

    await this.transactionsRepository.remove(transaction);
  }
}
