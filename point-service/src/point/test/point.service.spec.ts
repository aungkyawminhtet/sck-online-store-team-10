import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrderPoint, OrderPointStatus } from '../order-point.entity';
import { PointService } from '../point.service';
import { PointTransaction } from '../transaction.entity';
import { PointWallet } from '../wallet.entity';

describe('PointService', () => {
  let service: PointService;
  const walletRepository = { findOne: jest.fn() };
  const orderPointRepository = { find: jest.fn() };
  const transactionRepository = {};
  const dataSource = { transaction: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        {
          provide: getRepositoryToken(PointWallet),
          useValue: walletRepository,
        },
        {
          provide: getRepositoryToken(OrderPoint),
          useValue: orderPointRepository,
        },
        {
          provide: getRepositoryToken(PointTransaction),
          useValue: transactionRepository,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<PointService>(PointService);
  });

  it('returns pending and approved balances for one user', async () => {
    walletRepository.findOne.mockResolvedValue({ userId: 1, balance: 8 });
    orderPointRepository.find.mockResolvedValue([
      { userId: 1, pointsRemaining: 80, status: OrderPointStatus.PENDING },
    ]);

    await expect(service.getPoint(1)).resolves.toEqual({
      point: 8,
      pendingPoint: 80,
      approvedPoint: 8,
    });
    expect(walletRepository.findOne).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
  });

  it('calculates one point for every 50 THB', () => {
    expect(service.calculatePoint(4044.71)).toBe(80);
  });
});
