import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum TransactionType {
  EARN = 'EARN',
  SPEND = 'SPEND',
  EXPIRE = 'EXPIRE',
  VOID = 'VOID',
  APPROVE = 'APPROVE'
}

@Entity('point_transaction')
export class PointTransaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'wallet_id' })
  @Index('IDX_trans_wallet')
  walletId: number;

  @Column({ type: 'bigint', name: 'order_point_id', nullable: true })
  orderPointId: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column({ type: 'int', comment: '+ earn, - spend, - expire' })
  amount: number;

  @Column({ type: 'int', name: 'balance_after' })
  balanceAfter: number;

  @CreateDateColumn()
  created: Date;
}
