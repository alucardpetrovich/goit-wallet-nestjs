import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionCategoryEntity } from '../transaction-categories/transaction-category.entity';
import { UserEntity } from '../users/user.entity';
import { TransactionTypes } from '../../shared/enums/transaction-types.enum';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  transactionDate: string;

  @Column({ enum: TransactionTypes })
  type: TransactionTypes;

  @ManyToOne(() => TransactionCategoryEntity)
  @JoinColumn()
  category: TransactionCategoryEntity;

  @RelationId((transaction: TransactionEntity) => transaction.category)
  categoryId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @RelationId((transaction: TransactionEntity) => transaction.user)
  userId: string;

  @Column('text', { nullable: true })
  comment: string;

  @Column('float')
  amount: number;

  @Column('float')
  balanceAfter: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
