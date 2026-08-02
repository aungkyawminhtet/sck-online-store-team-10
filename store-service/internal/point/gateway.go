package point

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type PointGateway struct {
	PointEndpoint string
}

func (gateway PointGateway) GetPoints(ctx context.Context, uid int) ([]Point, error) {
	endPoint := gateway.PointEndpoint + "/api/v1/point"
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endPoint, nil)
	if err != nil {
		return []Point{}, err
	}
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return []Point{}, err
	}
	if response.StatusCode != 200 {
		return []Point{}, fmt.Errorf("response is not ok but it's %d", response.StatusCode)
	}
	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return []Point{}, err
	}

	var PointGatewayResponse []Point
	err = json.Unmarshal(responseData, &PointGatewayResponse)
	if err != nil {
		return []Point{}, err
	}

	return PointGatewayResponse, nil
}

func (gateway PointGateway) CreatePoint(ctx context.Context, uid int, body Point) (Point, error) {
	data, _ := json.Marshal(body)
	endPoint := gateway.PointEndpoint + "/api/v1/point"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endPoint, bytes.NewBuffer(data))
	if err != nil {
		return Point{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return Point{}, err
	}
	if response.StatusCode != 200 && response.StatusCode != 201 {
		return Point{}, fmt.Errorf("response is not ok but it's %d", response.StatusCode)
	}
	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return Point{}, err
	}

	var PointGatewayResponse Point
	err = json.Unmarshal(responseData, &PointGatewayResponse)
	if err != nil {
		return Point{}, err
	}

	return PointGatewayResponse, nil
}

type CalculatePointRequest struct {
	Amount float64 `json:"amount"`
}

type CalculatePointResponse struct {
	Points int `json:"points"`
}

func (gateway PointGateway) CalculatePoint(ctx context.Context, amount float64) (int, error) {
	requestBody := CalculatePointRequest{Amount: amount}
	data, _ := json.Marshal(requestBody)

	endPoint := gateway.PointEndpoint + "/api/v1/point/calculate"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endPoint, bytes.NewBuffer(data))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 && response.StatusCode != 201 {
		return 0, fmt.Errorf("response is not ok but it's %d", response.StatusCode)
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return 0, err
	}

	var result CalculatePointResponse
	err = json.Unmarshal(responseData, &result)
	if err != nil {
		return 0, err
	}

	return result.Points, nil
}
