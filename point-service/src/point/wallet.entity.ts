import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('point_wallet')
export class PointWallet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', unique: true })
  @Index('IDX_wallet_user_id')
  userId: number;

  @Column({ type: 'int', default: 0, comment: 'Cached active balance' })
  balance: number;
}
