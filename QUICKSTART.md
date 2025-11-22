# 🚀 Quick Start Guide
## Freight Forwarding Automation System

Get up and running in **5 minutes** with Docker!

## Prerequisites

- Docker & Docker Compose installed
- Git installed
- 4GB RAM minimum
- 10GB disk space

## Quick Setup (3 Steps)

### Step 1: Clone and Configure

```bash
# Clone the repository
cd Freight-Forwarding-Automation-System

# Create environment file
cp .env.example .env

# IMPORTANT: Open .env and set these values:
# SECRET_KEY=your-secure-random-key-min-32-characters
# JWT_SECRET_KEY=another-secure-random-key-min-32-characters
```

**Generate secure keys:**
```bash
# Run this command twice to generate two keys:
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 2: Start the System

```bash
# Start all services
docker-compose up -d

# Wait 30 seconds for services to start, then initialize database
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.initial_data
```

### Step 3: Access the Application

Open your browser and go to:

- **Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Change this password immediately after login!**

---

## What's Running?

After `docker-compose up -d`, you'll have:

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React app |
| Backend API | 8000 | FastAPI server |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & queue |
| Celery Worker | - | Background tasks |
| Celery Beat | - | Task scheduler |

---

## Common Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove all data (⚠️ destroys database!)
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend python manage.py shell
```

---

## Verify Installation

1. ✅ Frontend loads at http://localhost:3000
2. ✅ Can login with default credentials
3. ✅ Dashboard shows statistics
4. ✅ API docs load at http://localhost:8000/docs
5. ✅ Can create a test shipment

---

## Next Steps

1. **Change Default Password**
   - Go to Profile → Change Password

2. **Create Users**
   - Go to Users → Add User
   - Assign appropriate roles

3. **Configure Email**
   - Update SMTP settings in `.env`
   - Restart: `docker-compose restart backend`

4. **Add First Shipment**
   - Go to Shipments → New Shipment
   - Fill in details and save

5. **Read Documentation**
   - [Installation Guide](docs/INSTALLATION.md) - Detailed setup
   - [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
   - [Frontend Implementation](docs/FRONTEND_IMPLEMENTATION.md) - Development guide
   - [API Documentation](http://localhost:8000/docs) - API reference

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs for errors
docker-compose logs

# Check if ports are already in use
sudo lsof -i :3000  # Frontend
sudo lsof -i :8000  # Backend
sudo lsof -i :5432  # PostgreSQL

# Try fresh start
docker-compose down
docker-compose up -d
```

### Database Connection Error

```bash
# Wait for database to be ready
docker-compose exec db pg_isready -U postgres

# If not ready, restart database
docker-compose restart db
```

### Frontend Shows 404

```bash
# Check if backend is running
curl http://localhost:8000/health

# Restart frontend
docker-compose restart frontend
```

### Can't Login

```bash
# Recreate admin user
docker-compose exec backend python -m app.initial_data

# Check database
docker-compose exec db psql -U postgres -d freight_db -c "SELECT email FROM users;"
```

---

## Development Mode

For development with hot-reload:

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
freight-forwarding-system/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core config
│   │   ├── models/      # Database models
│   │   └── main.py      # App entry
│   └── requirements.txt
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.tsx      # Main component
│   └── package.json
│
├── docker/              # Docker configs
├── docs/                # Documentation
├── docker-compose.yml   # Service orchestration
└── .env                 # Environment variables
```

---

## Key Features

✅ **Shipment Management**
- Create, track, and manage shipments
- Container tracking
- Status updates
- Timeline view

✅ **Document Management**
- Upload documents (PDF, images)
- OCR processing (coming soon)
- Document viewer
- Search and filter

✅ **Customer Management**
- Customer database
- Contact information
- Communication preferences

✅ **User Management**
- Role-based access control
- User permissions
- Activity logging

✅ **Dashboard**
- Real-time statistics
- Charts and graphs
- Recent activity feed

---

## Need Help?

- **Documentation**: Check the `/docs` folder
- **API Docs**: http://localhost:8000/docs
- **Issues**: Create an issue on GitHub
- **Email**: support@yourcompany.com

---

## Production Deployment

For production deployment:

1. Use a proper domain with HTTPS/SSL
2. Change all default passwords
3. Set strong SECRET_KEY and JWT_SECRET_KEY
4. Set DEBUG=false
5. Configure production database
6. Set up automated backups
7. Enable 2FA for admin users

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## License

Proprietary - © 2025 Your Company Name

---

**You're all set! 🎉**

Your Freight Forwarding Automation System is now running.

For questions or support, check the documentation in `/docs` or contact your administrator.
