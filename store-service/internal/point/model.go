package point

type SubmitedPoint struct {
	Amount  int `json:"amount"`
	OrderID int `json:"orderId,omitempty"`
}

type Point struct {
	OrgID   int `json:"orgId"`
	UserID  int `json:"userId"`
	Amount  int `json:"amount"`
	OrderID int `json:"orderId,omitempty"`
}

type TotalPoint struct {
	Point         int `json:"point"`
	PendingPoint  int `json:"pending_point"`
	ApprovedPoint int `json:"approved_point"`
}
