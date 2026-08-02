import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApprovePointDto, CreatePointDto, PointBalanceDto } from './point.dto';
import { OrderPoint, OrderPointStatus } from './order-point.entity';
import { PointTransaction, TransactionType } from './transaction.entity';
import { PointWallet } from './wallet.entity';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);

  constructor(
    @InjectRepository(PointWallet)
    private readonly walletRepository: Repository<PointWallet>,
    @InjectRepository(OrderPoint)
    private readonly orderPointRepository: Repository<OrderPoint>,
    @InjectRepository(PointTransaction)
    private readonly transactionRepository: Repository<PointTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  async getPoint(userId: number): Promise<PointBalanceDto> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    const pendingOrders = await this.orderPointRepository.find({
      where: { userId, status: OrderPointStatus.PENDING },
    });
    const pendingPoint = pendingOrders.reduce(
      (total, orderPoint) => total + orderPoint.pointsRemaining,
      0,
    );
    const approvedPoint = wallet?.balance ?? 0;

    return {
      point: approvedPoint,
      pendingPoint,
      approvedPoint,
    };
  }

  async deductPoint(point: CreatePointDto): Promise<PointBalanceDto> {
    if (point.amount === 0) {
      return this.getPoint(point.userId);
    }

    await this.dataSource.transaction(async (manager) => {
      const walletRepository = manager.getRepository(PointWallet);
      const orderPointRepository = manager.getRepository(OrderPoint);
      const transactionRepository = manager.getRepository(PointTransaction);

      let wallet = await walletRepository.findOne({
        where: { userId: point.userId },
      });
      if (!wallet) {
        wallet = await walletRepository.save(
          walletRepository.create({ userId: point.userId, balance: 0 }),
        );
      }

      if (point.amount > 0) {
        if (point.orderId) {
          const existing = await orderPointRepository.findOne({
            where: { userId: point.userId, orderId: point.orderId },
          });
          if (existing) return;
        }

        const pendingPoint = await orderPointRepository.save(
          orderPointRepository.create({
            walletId: wallet.id,
            userId: point.userId,
            orderId: point.orderId,
            pointsEarned: point.amount,
            pointsRemaining: point.amount,
            status: OrderPointStatus.PENDING,
          }),
        );
        await transactionRepository.save(
          transactionRepository.create({
            walletId: wallet.id,
            orderPointId: pendingPoint.id,
            type: TransactionType.EARN,
            amount: point.amount,
            balanceAfter: wallet.balance,
          }),
        );
        return;
      }

      const nextBalance = wallet.balance + point.amount;
      if (nextBalance < 0) {
        throw new BadRequestException(
          'points are not enough, please try again',
        );
      }
      wallet.balance = nextBalance;
      await walletRepository.save(wallet);
      await transactionRepository.save(
        transactionRepository.create({
          walletId: wallet.id,
          orderPointId: null,
          type: TransactionType.SPEND,
          amount: point.amount,
          balanceAfter: nextBalance,
        }),
      );
    });

    this.logger.log(
      `Point transaction stored: userId=${point.userId}, orderId=${
        point.orderId ?? 'none'
      }, amount=${point.amount}`,
    );
    return this.getPoint(point.userId);
  }

  async approvePoint(input: ApprovePointDto): Promise<PointBalanceDto> {
    await this.dataSource.transaction(async (manager) => {
      const walletRepository = manager.getRepository(PointWallet);
      const orderPointRepository = manager.getRepository(OrderPoint);
      const transactionRepository = manager.getRepository(PointTransaction);
      const orderPoint = await orderPointRepository.findOne({
        where: {
          userId: input.userId,
          orderId: input.orderId,
          status: OrderPointStatus.PENDING,
        },
      });
      if (!orderPoint) {
        throw new BadRequestException('pending points were not found');
      }

      const wallet = await walletRepository.findOneOrFail({
        where: { id: orderPoint.walletId },
      });
      wallet.balance += orderPoint.pointsRemaining;
      orderPoint.status = OrderPointStatus.ACTIVE;
      await walletRepository.save(wallet);
      await orderPointRepository.save(orderPoint);
      await transactionRepository.save(
        transactionRepository.create({
          walletId: wallet.id,
          orderPointId: orderPoint.id,
          type: TransactionType.APPROVE,
          amount: orderPoint.pointsRemaining,
          balanceAfter: wallet.balance,
        }),
      );
    });

    return this.getPoint(input.userId);
  }

  calculatePoint(amount: number): number {
    if (amount < 0) return 0;
    return Math.floor(amount / 50);
  }
}
