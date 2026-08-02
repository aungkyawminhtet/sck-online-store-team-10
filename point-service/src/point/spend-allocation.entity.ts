import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('point_spend_allocation')
export class PointSpendAllocation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'order_point_id' })
  @Index('IDX_spend_order_point')
  orderPointId: number;

  @Column({ type: 'bigint', name: 'spend_order_id' })
  spendOrderId: number;

  @Column({ type: 'int', name: 'points_used' })
  pointsUsed: number;
}
