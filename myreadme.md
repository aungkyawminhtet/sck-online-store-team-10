# SCK Online Store - Developer Quick Guide

This guide contains the main commands for running the application and using its API collections.
Run all commands from the repository root unless a section says otherwise.

## 1. Run Commands

### Prerequisites

- Docker Desktop with Docker Compose v2
- Node.js and npm (for running Node services locally)
- Go (for running the store service locally)
- Newman (optional, for command-line API tests)

### Run the complete application

The recommended approach is to run the complete stack with Docker Compose:

```bash
docker compose up -d db adminer liquibase thirdparty point-service store-service store-web nginx --build
```

If GNU Make is available, the equivalent command is:

```bash
make start_all
```

Open the application at <http://localhost>.

### Run the database

Start MySQL:

```bash
docker compose up -d db
```

Apply the Liquibase database migrations:

```bash
docker compose up liquibase
```

Start Adminer to inspect the database:

```bash
docker compose up -d adminer
```

Open Adminer at <http://localhost:8080> and use:

| Field | Value |
| --- | --- |
| System | MySQL |
| Server | `db` |
| Username | `user` |
| Password | `password` |
| Database | `store` or `point` |

### Run the frontend

Run the Next.js frontend with Docker:

```bash
docker compose up -d store-web --build
```

The frontend is available directly at <http://localhost:3000>.

To run it locally in development mode:

```bash
cd store-web
npm install
npm run dev
```

### Run the main backend

The main store backend is written in Go and listens on port `8000`.

Run it with Docker:

```bash
docker compose up -d store-service --build
```

The service requires MySQL, the point service, and the mock third-party gateways. Start its dependencies with:

```bash
docker compose up -d db liquibase point-service thirdparty
```

To run the Go backend locally on Windows PowerShell:

```powershell
cd store-service
$env:DB_CONNECTION='user:password@tcp(localhost:3306)/store?parseTime=true'
$env:POINT_GATEWAY='localhost:8001'
$env:BANK_GATEWAY='localhost:8882'
$env:SHIPPING_GATEWAY='localhost:8883'
$env:JWT_SECRET='my-secret-key'
go run ./cmd
```

The API is available at <http://localhost:8000>, and Swagger UI is available at <http://localhost:8000/swagger/index.html>.

### Run the point backend

The reward-point service is written in NestJS and listens on port `8001`.

Run it with Docker:

```bash
docker compose up -d point-service --build
```

To run it locally:

```bash
cd point-service
npm install
npm run start:dev
```

### Run the mock bank and shipping gateways

```bash
docker compose up -d thirdparty --build
```

- Bank gateway: <http://localhost:8882>
- Shipping gateway: <http://localhost:8883>

### Check logs and service status

```bash
docker compose ps
docker compose logs -f store-service
docker compose logs -f point-service
docker compose logs -f store-web
```

### Stop the application

```bash
docker compose down
```

## 2. API Collections

### Postman documentation collection

Import these files into Postman:

- `api-doc/SCK-Online-Store-Doc.postman_collection.json`
- `api-doc/SCK-Online-Store.postman_environment.json`

The collection documents the store APIs and can be used for manual API testing.

### Acceptance-test collections

The API acceptance tests are stored under `atdd/api`:

| File | Purpose |
| --- | --- |
| `atdd/api/sck-online-store.postman_collection.json` | Complete application collection |
| `atdd/api/collections/001-Authentication.postman_collection.json` | Authentication scenarios |
| `atdd/api/collections/002-Order-Summary-PDF.postman_collection.json` | Order-summary PDF scenarios |
| `atdd/api/sck-online-store.local.postman_environment.json` | Local environment |
| `atdd/api/sck-online-store.remote.postman_environment.json` | Remote environment |

Install Newman and its HTML reporter if they are not already installed:

```bash
npm install -g newman newman-reporter-htmlextra
```

Run all API acceptance tests:

```bash
make run_newman
```

Run only authentication tests:

```bash
make run_newman_authentication
```

Run only order-summary PDF tests:

```bash
make run_newman_order_summary_pdf
```

### Main store API endpoints

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Check service and database health | No |
| `POST` | `/api/v1/login` | Log in | No |
| `GET` | `/api/v1/refreshToken` | Refresh the access token | Refresh-token cookie |
| `GET` | `/api/v1/product` | Search or list products | JWT |
| `GET` | `/api/v1/product/:id` | Get product details | JWT |
| `GET` | `/api/v1/cart` | Get the user's cart | JWT |
| `PUT` | `/api/v1/addCart` | Add a product to the cart | JWT |
| `PUT` | `/api/v1/updateCart` | Change or remove a cart item | JWT |
| `POST` | `/api/v1/order` | Create an order | JWT |
| `POST` | `/api/v1/order/:id/summary` | Download an order-summary PDF | JWT |
| `POST` | `/api/v1/confirmPayment` | Confirm payment and request tracking | JWT |
| `GET` | `/api/v1/point` | Get the user's point balance | JWT |
| `POST` | `/api/v1/point` | Deduct points | JWT |

For protected endpoints, send the access token in the request header:

```text
Authorization: Bearer <access-token>
```

## 3. Application URLs

| Component | URL |
| --- | --- |
| Application through Nginx | <http://localhost> |
| Next.js frontend | <http://localhost:3000> |
| Store API | <http://localhost:8000> |
| Swagger UI | <http://localhost:8000/swagger/index.html> |
| Point service | <http://localhost:8001> |
| Adminer | <http://localhost:8080> |
| Bank gateway | <http://localhost:8882> |
| Shipping gateway | <http://localhost:8883> |

## 4. Project Components

- `store-web` - Next.js, React, TypeScript, Tailwind CSS, and Zustand frontend
- `store-service` - Go and Gin store API
- `point-service` - NestJS and TypeORM reward-point service
- `db` and `tearup` - database migrations and initialization data
- `thirdparty` - mock bank and shipping gateways
- `atdd` - API, UI, and load tests
- `monitoring` - OpenTelemetry and Grafana observability configuration
- `deploy` - Kubernetes and Terraform deployment files

## 5. Common Troubleshooting

### API returns 401 Unauthorized

Log in again and confirm that the request contains the `Authorization: Bearer <access-token>` header. The frontend stores the access token in browser `localStorage` and the refresh token in an HTTP-only cookie.

### A port is already in use

Check running containers:

```bash
docker compose ps
```

Stop the stack before restarting it:

```bash
docker compose down
```

### A service does not start

Inspect its logs:

```bash
docker compose logs --tail=200 store-service
docker compose logs --tail=200 point-service
docker compose logs --tail=200 db
```
