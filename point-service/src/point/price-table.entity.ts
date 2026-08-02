import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('price_table')
export class PriceTable {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'min_order_amount' })
  minOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'max_order_amount' })
  maxOrderAmount: number;

  @Column({ type: 'int', name: 'points_awarded' })
  pointsAwarded: number;
}
