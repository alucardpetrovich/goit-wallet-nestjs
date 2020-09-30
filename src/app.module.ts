import { Module } from '@nestjs/common';
import { configModule } from './config/config.module';
import { databaseModule } from './database/database.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TransactionCategoriesModule } from './modules/transaction-categories/transaction-categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TransactionsSummaryModule } from './modules/transactions-summary/transactions-summary.module';

@Module({
  imports: [
    configModule,
    databaseModule,
    SessionsModule,
    UsersModule,
    TransactionsModule,
    TransactionCategoriesModule,
    AuthModule,
    TransactionsSummaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
