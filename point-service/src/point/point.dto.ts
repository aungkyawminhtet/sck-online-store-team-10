export class CreatePointDto {
  orgId: number;
  userId: number;
  amount: number;
  orderId?: number;
}

export class PointBalanceDto {
  point: number;
  pendingPoint: number;
  approvedPoint: number;
}

export class ApprovePointDto {
  userId: number;
  orderId: number;
}

export class CalculatePointDto {
  amount: number;
}
