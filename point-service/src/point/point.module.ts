import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Point } from './point.entity';
import { PointWallet } from './wallet.entity';
import { OrderPoint } from './order-point.entity';
import { PointTransaction } from './transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Point,
      PointWallet,
      OrderPoint,
      PointTransaction,
    ]),
  ],
  providers: [PointService],
  controllers: [PointController],
})
export class PointModule {}
