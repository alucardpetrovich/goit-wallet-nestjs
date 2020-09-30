import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { GetTransactionSummaryQueryDto } from './dto/get-transaction-summary-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';
import {
  TransactionsSummarySerializer,
  CategorySummarySerializer,
} from './serializers/transactions-summary.serializer';

@Injectable()
export class TransactionsSummaryService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async aggregateTransactionsSummary(
    { year, month }: GetTransactionSummaryQueryDto,
    user: UserEntity,
  ): Promise<TransactionsSummarySerializer> {
    const parameters: (string | number)[] = [user.id];

    if (year) {
      parameters.push(year);
    }
    if (month) {
      parameters.push(month);
    }

    const categoriesSummary: CategorySummarySerializer[] = await this.transactionsRepository.query(
      `
      SELECT c.name, t.type, SUM(t.amount) AS total FROM transaction_categories AS c
      INNER JOIN transactions AS t ON t."categoryId" = c.id AND t."userId" = $1
      ${year ? 'AND EXTRACT(YEAR FROM t."transactionDate") = $2' : ''}
      ${month ? 'AND EXTRACT(MONTH FROM t."transactionDate") = $3' : ''}
      GROUP BY c.name, c.id, t.type
    `,
      parameters,
    );

    return {
      categoriesSummary,
      incomeSummary: this.getTypeSummary(
        categoriesSummary,
        TransactionTypes.INCOME,
      ),
      expenseSummary: this.getTypeSummary(
        categoriesSummary,
        TransactionTypes.EXPENSE,
      ),
      periodTotal: this.getTypeSummary(categoriesSummary),
      year: year || null,
      month: month || null,
    };
  }

  private getTypeSummary(
    categoriesSummary: CategorySummarySerializer[],
    type: TransactionTypes = null,
  ): number {
    return categoriesSummary
      .filter(catSummary => (type ? catSummary.type === type : true))
      .reduce((sum, catSummary) => sum + catSummary.total, 0);
  }
}
