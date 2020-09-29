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
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';

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

    const updatedUser = await this.usersService.updateUserBalance(
      user,
      this.getBalanceToAdd(amount, type),
    );

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

    const amountDiff = updateTransactionDto.amount - transaction.amount;
    let updatedUser: UserEntity;
    if (amountDiff) {
      updatedUser = await this.usersService.updateUserBalance(
        user,
        this.getBalanceToAdd(amountDiff, transaction.type),
      );
    }

    const transactionToUpdate = this.transactionsRepository.merge(transaction, {
      ...updateTransactionDto,
      category: {
        id: updateTransactionDto.categoryId && transaction.categoryId,
      },
      balanceAfter: amountDiff ? updatedUser.balance : transaction.balanceAfter,
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

    await this.usersService.updateUserBalance(
      user,
      0 - this.getBalanceToAdd(transaction.amount, transaction.type),
    );

    await this.transactionsRepository.remove(transaction);
  }

  private getBalanceToAdd(
    amountToAdd: number,
    transactionType: TransactionTypes,
  ): number {
    return transactionType === TransactionTypes.EXPENSE
      ? 0 - amountToAdd
      : amountToAdd;
  }
}
