# Freight Forwarding Automation System

A comprehensive freight forwarding automation platform built with React + TypeScript (Frontend) and FastAPI + Python (Backend).

## Features

- 🚢 **Shipment Management**: Complete shipment lifecycle tracking
- 📄 **Document Management**: Upload, OCR processing, and document viewer
- 🤖 **Browser Automation**: Automated carrier portal scraping and tracking
- 📊 **Dashboard & Analytics**: Real-time KPIs and custom reports
- 💬 **Multi-channel Communication**: Email, WhatsApp, SMS notifications
- 👥 **User Management**: Role-based access control (RBAC)
- 🔒 **Security**: JWT authentication, 2FA, encryption
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite (Build tool)
- TanStack Query (Server state)
- Zustand (Client state)
- React Router v6
- Tailwind CSS + shadcn/ui
- Axios (HTTP client)
- Chart.js (Analytics)

### Backend
- FastAPI 0.104+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- SQLAlchemy (ORM)
- Alembic (Migrations)
- Celery (Task queue)
- Tesseract OCR
- Selenium (Browser automation)

### Infrastructure
- Docker & Docker Compose
- Nginx (Reverse proxy)
- Let's Encrypt (SSL)

## Project Structure

```
freight-forwarding-system/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── tasks/          # Celery tasks
│   │   └── main.py         # Application entry
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
│
├── docker/                 # Docker configurations
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml      # Docker services
├── .env.example            # Environment variables template
└── docs/                   # Documentation
    ├── INSTALLATION.md     # Setup guide
    ├── DEPLOYMENT.md       # Deployment guide
    └── API.md              # API documentation
```

## Quick Start

### Prerequisites

- Docker & Docker Compose (v2.0+)
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Freight-Forwarding-Automation-System
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker (Recommended)**
```bash
docker-compose up -d
```

4. **Initialize Database**
```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.initial_data
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Default Credentials
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Change these immediately in production!**

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [API Documentation](docs/API.md) - API endpoints reference
- [User Manual](docs/USER_MANUAL.md) - End-user guide
- [Admin Guide](docs/ADMIN_GUIDE.md) - Administration guide

## Features Implementation Status

- ✅ Authentication & Authorization
- ✅ User Management
- ✅ Shipment Management
- ✅ Document Management
- ✅ Dashboard & Analytics
- 🚧 OCR Processing (In Progress)
- 🚧 Browser Automation (In Progress)
- 🚧 Communication System (In Progress)
- 📋 Advanced Reporting (Planned)

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to VPS

```bash
# On your VPS
git clone <repository-url>
cd Freight-Forwarding-Automation-System
./scripts/deploy.sh
```

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Contact: support@yourcompany.com

## License

Proprietary - © 2025 Your Company Name

## Contributors

- Development Team
- Product Owner
- QA Team

---

Built with ❤️ for efficient freight forwarding operations
