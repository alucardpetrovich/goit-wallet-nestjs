import { Module } from '@nestjs/common';
import { TransactionsSummaryController } from './transactions-summary.controller';
import { TransactionsSummaryService } from './transactions-summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), SessionsModule],
  controllers: [TransactionsSummaryController],
  providers: [TransactionsSummaryService],
})
export class TransactionsSummaryModule {}
