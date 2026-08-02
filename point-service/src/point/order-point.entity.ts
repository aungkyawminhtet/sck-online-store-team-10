import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum OrderPointStatus {
  ACTIVE = 'ACTIVE',
  SPENT = 'SPENT',
  EXPIRED = 'EXPIRED',
  VOID = 'VOID'
}

@Entity('order_point')
export class OrderPoint {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'wallet_id' })
  @Index('IDX_order_point_wallet')
  walletId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'bigint', name: 'order_id', nullable: true })
  orderId: number;

  @Column({ type: 'int', name: 'points_earned' })
  pointsEarned: number;

  @Column({ type: 'int', name: 'points_remaining' })
  pointsRemaining: number;

  @Column({
    type: 'enum',
    enum: OrderPointStatus,
    default: OrderPointStatus.ACTIVE
  })
  status: OrderPointStatus;

  @CreateDateColumn({ name: 'confirmed_at' })
  confirmedAt: Date;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  expiresAt: Date;
}
