import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { PointModule } from './point/point.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './point/point.entity';
import { PointWallet } from './point/wallet.entity';
import { PriceTable } from './point/price-table.entity';
import { OrderPoint } from './point/order-point.entity';
import { PointSpendAllocation } from './point/spend-allocation.entity';
import { PointTransaction } from './point/transaction.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'point',
      entities: [
        Point,
        PointWallet,
        PriceTable,
        OrderPoint,
        PointSpendAllocation,
        PointTransaction,
      ],
      synchronize: true,
    }),
    HelloModule,
    PointModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
