import { Module } from '@nestjs/common';
import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCategoryEntity } from './transaction-category.entity';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionCategoryEntity]),
    SessionsModule,
  ],
  controllers: [TransactionCategoriesController],
  providers: [TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
