import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionCategoryEntity } from './transaction-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategoryEntity)
    private transactionCategoriesRepository: Repository<
      TransactionCategoryEntity
    >,
  ) {}

  async getTransactionCategories(): Promise<TransactionCategoryEntity[]> {
    return this.transactionCategoriesRepository.find();
  }

  async getTransactionCategoryById(
    transactionCategoryId: string,
  ): Promise<TransactionCategoryEntity> {
    return this.transactionCategoriesRepository.findOne(transactionCategoryId);
  }
}
