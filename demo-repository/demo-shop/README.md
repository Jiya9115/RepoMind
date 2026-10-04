# DemoShop - E-Commerce Platform

A production-grade e-commerce microservices and web application for DemoShop Inc.

## Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend API**: Python FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL with async connections
- **Services**:
  - `UserService`: User authentication, profile management, role-based access control.
  - `PaymentService`: Credit card processing, gateway integration, refund processing.
  - `OrderService`: Shopping cart checkout, order status state machine, notifications.

## Getting Started

```bash
# Backend setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend setup
cd ../frontend
npm install
npm run dev
```
