package point

import (
	"context"
	"fmt"
	"log/slog"
)

type PointInterface interface {
	TotalPoint(ctx context.Context, uid int) (TotalPoint, error)
	DeductPoint(ctx context.Context, uid int, submitedPoint SubmitedPoint) (TotalPoint, error)
	CheckBurnPoint(ctx context.Context, uid int, amount int) (bool, error)
	CalculatePoint(ctx context.Context, amount float64) (int, error)
}

type PointService struct {
	PointGateway PointGatewayInterface
}

type PointGatewayInterface interface {
	GetPointBalance(ctx context.Context, uid int) (TotalPoint, error)
	CreatePoint(ctx context.Context, uid int, body Point) (Point, error)
	CalculatePoint(ctx context.Context, amount float64) (int, error)
}

func (pointService PointService) TotalPoint(ctx context.Context, uid int) (TotalPoint, error) {
	total, err := pointService.PointGateway.GetPointBalance(ctx, uid)
	if err != nil {
		slog.ErrorContext(ctx, "PointGateway.GetPoints failed",
			"log_type", "error", "error_code", "POINT_GATEWAY_FAILED", "error_message", err.Error(), "user_id", uid)
	}

	return total, err
}

func (pointService PointService) DeductPoint(ctx context.Context, uid int, submitedPoint SubmitedPoint) (TotalPoint, error) {
	_, err := pointService.CheckBurnPoint(ctx, uid, submitedPoint.Amount)
	if err != nil {
		return TotalPoint{}, err
	}

	point := Point{
		OrgID:   1,
		UserID:  uid,
		Amount:  submitedPoint.Amount,
		OrderID: submitedPoint.OrderID,
	}
	_, err_ := pointService.PointGateway.CreatePoint(ctx, uid, point)
	if err_ != nil {
		slog.ErrorContext(ctx, "PointGateway.CreatePoint failed",
			"log_type", "error", "error_code", "POINT_CREATE_FAILED", "error_message", err_.Error(),
			"user_id", uid, "amount", submitedPoint.Amount)
		return TotalPoint{}, err_
	}
	return pointService.TotalPoint(ctx, uid)
}

func (pointService PointService) CheckBurnPoint(ctx context.Context, uid int, amount int) (bool, error) {
	total, err := pointService.TotalPoint(ctx, uid)
	if err != nil {
		slog.ErrorContext(ctx, "PointService.TotalPoint failed",
			"log_type", "error", "error_code", "POINT_CHECK_FAILED", "error_message", err.Error(), "user_id", uid)
		return false, err
	}
	if amount+total.Point < 0 {
		return false, fmt.Errorf("points are not enough, please try again")
	}
	return true, nil
}

func (pointService PointService) CalculatePoint(ctx context.Context, amount float64) (int, error) {
	return pointService.PointGateway.CalculatePoint(ctx, amount)
}
