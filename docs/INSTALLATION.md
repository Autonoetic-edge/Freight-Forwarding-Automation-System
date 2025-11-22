# Installation Guide
## Freight Forwarding Automation System

This guide provides step-by-step instructions for installing and setting up the Freight Forwarding Automation System.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Local Development Setup](#local-development-setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### For Docker Deployment (Recommended)
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository
- **Minimum Hardware**:
  - CPU: 2 cores
  - RAM: 4GB
  - Storage: 20GB available space

### For Local Development
- **Node.js**: Version 18 or higher
- **Python**: Version 3.11 or higher
- **PostgreSQL**: Version 15 or higher
- **Redis**: Version 7 or higher
- **Tesseract OCR**: For OCR functionality
- **Chrome/Chromium**: For browser automation

---

## Quick Start with Docker

This is the **recommended** method for getting started quickly.

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourcompany/freight-forwarding-system.git
cd freight-forwarding-system
```

### Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your settings
nano .env  # or use your preferred editor
```

**Important settings to change:**
```env
# Generate a secure secret key (minimum 32 characters)
SECRET_KEY=your-very-secure-secret-key-at-least-32-chars-long
JWT_SECRET_KEY=your-very-secure-jwt-secret-key-at-least-32-chars-long

# Database credentials (change for production)
DB_PASSWORD=your_secure_database_password

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourcompany.com
```

### Step 3: Start the Application

```bash
# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps
```

You should see all services running:
- `freight_db` (PostgreSQL)
- `freight_redis` (Redis)
- `freight_backend` (FastAPI)
- `freight_frontend` (React)
- `freight_celery_worker` (Background tasks)
- `freight_celery_beat` (Task scheduler)

### Step 4: Initialize the Database

```bash
# Run database migrations
docker-compose exec backend alembic upgrade head

# Create initial data (admin user, sample data)
docker-compose exec backend python -m app.initial_data
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

**Default Login Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change these credentials immediately after first login!**

### Step 6: Verify Installation

1. Open http://localhost:3000 in your browser
2. Login with the default credentials
3. You should see the dashboard
4. Try creating a test shipment

---

## Local Development Setup

For developers who want to run the application locally without Docker.

### Backend Setup

#### 1. Install Python Dependencies

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y \
    postgresql-client \
    tesseract-ocr \
    tesseract-ocr-eng \
    chromium-browser \
    chromium-chromedriver \
    libpq-dev \
    python3-dev
```

**macOS:**
```bash
brew install postgresql tesseract chromium chromedriver
```

**Windows:**
- Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
- Install Chrome/ChromeDriver: https://chromedriver.chromium.org/

#### 3. Configure PostgreSQL

```bash
# Create database
createdb freight_db

# Or using psql
psql -U postgres
CREATE DATABASE freight_db;
CREATE USER freight_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE freight_db TO freight_user;
\q
```

#### 4. Configure Redis

```bash
# Install Redis
sudo apt-get install redis-server  # Ubuntu/Debian
brew install redis  # macOS

# Start Redis
redis-server
```

#### 5. Run Database Migrations

```bash
cd backend

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://freight_user:your_password@localhost:5432/freight_db

# Run migrations
alembic upgrade head

# Create initial data
python -m app.initial_data
```

#### 6. Start Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 7. Start Celery Workers (In separate terminals)

```bash
# Terminal 1: Celery Worker
celery -A app.tasks.celery_app worker --loglevel=info

# Terminal 2: Celery Beat (Scheduler)
celery -A app.tasks.celery_app beat --loglevel=info
```

### Frontend Setup

#### 1. Install Node.js Dependencies

```bash
cd frontend

# Install dependencies
npm install
```

#### 2. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

Update the API URL:
```env
VITE_API_URL=http://localhost:8000
```

#### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:3000 (or the port shown in terminal).

---

## Database Setup

### Understanding the Database Schema

The system uses PostgreSQL with the following main tables:

- **users**: User accounts and authentication
- **customers**: Customer information
- **shipments**: Shipment records
- **containers**: Container details
- **tracking_events**: Tracking history
- **documents**: Document metadata
- **ocr_results**: OCR extracted data
- **communications**: Communication logs
- **activity_logs**: Audit trail
- **carrier_configs**: Carrier automation settings

### Database Migrations

The system uses Alembic for database migrations.

#### Create a New Migration

```bash
cd backend

# Auto-generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Review the generated migration file in alembic/versions/

# Apply the migration
alembic upgrade head
```

#### Rollback Migration

```bash
# Rollback one version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# Rollback all
alembic downgrade base
```

#### View Migration History

```bash
# Current version
alembic current

# Migration history
alembic history

# Show SQL for migration (don't execute)
alembic upgrade head --sql
```

### Backup and Restore

#### Backup Database

```bash
# Full backup
pg_dump -U freight_user freight_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U freight_user freight_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# With Docker
docker-compose exec db pg_dump -U postgres freight_db > backup.sql
```

#### Restore Database

```bash
# Restore from backup
psql -U freight_user freight_db < backup.sql

# Restore compressed backup
gunzip -c backup.sql.gz | psql -U freight_user freight_db

# With Docker
docker-compose exec -T db psql -U postgres freight_db < backup.sql
```

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the root directory:

```env
# Application
APP_NAME="Freight Forwarding System"
APP_ENV=development
DEBUG=true
SECRET_KEY=<generate-secure-key>
JWT_SECRET_KEY=<generate-secure-jwt-key>

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/freight_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=52428800

# OCR
OCR_ENABLED=true
TESSERACT_PATH=/usr/bin/tesseract

# Browser Automation
SELENIUM_ENABLED=true
HEADLESS_BROWSER=true
```

### Frontend Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Freight Forwarding System"
```

### Generating Secure Keys

```bash
# Method 1: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Method 2: Using OpenSSL
openssl rand -base64 32

# Method 3: Using /dev/urandom (Linux/Mac)
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

---

## Troubleshooting

### Docker Issues

#### Services Won't Start

```bash
# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Clean restart (removes containers)
docker-compose down
docker-compose up -d
```

#### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8000  # Backend port
sudo lsof -i :3000  # Frontend port
sudo lsof -i :5432  # PostgreSQL port

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

#### Database Connection Error

```bash
# Check if database is ready
docker-compose exec db pg_isready -U postgres

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Backend Issues

#### Import Errors

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

#### Database Migration Errors

```bash
# Drop all tables and recreate (⚠️ destroys data!)
alembic downgrade base
alembic upgrade head

# Or recreate database
dropdb freight_db
createdb freight_db
alembic upgrade head
```

#### Celery Not Working

```bash
# Check Redis connection
redis-cli ping  # Should return PONG

# Check Celery status
celery -A app.tasks.celery_app inspect active

# Restart Celery workers
# Kill existing workers
pkill -f 'celery worker'

# Restart
celery -A app.tasks.celery_app worker --loglevel=info
```

### Frontend Issues

#### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

#### API Connection Error

Check:
1. Backend is running: http://localhost:8000/health
2. CORS is configured correctly in backend
3. `VITE_API_URL` in frontend `.env` is correct

### Permission Issues

```bash
# Fix upload directory permissions
sudo chown -R $USER:$USER uploads/

# Or with Docker
docker-compose exec backend chown -R root:root /app/uploads
```

### Common Error Messages

#### "alembic.util.exc.CommandError: Can't locate revision identified by..."

```bash
# Reset alembic
rm alembic/versions/*.py
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

#### "FATAL: password authentication failed for user"

- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL user credentials
- Reset PostgreSQL password if needed

#### "Redis connection refused"

```bash
# Start Redis
redis-server

# Or with Docker
docker-compose up redis -d
```

---

## Next Steps

After successful installation:

1. **Change Default Credentials**
   - Login and go to Settings → Profile
   - Update admin password

2. **Configure Email**
   - Add your SMTP credentials
   - Test email sending

3. **Add Users**
   - Go to Users → Add User
   - Assign appropriate roles

4. **Create First Shipment**
   - Navigate to Shipments → New Shipment
   - Fill in details and save

5. **Upload Documents**
   - Open a shipment
   - Upload documents (PDF, images)
   - Test OCR if enabled

6. **Review Documentation**
   - [User Manual](USER_MANUAL.md)
   - [Admin Guide](ADMIN_GUIDE.md)
   - [API Documentation](API.md)
   - [Deployment Guide](DEPLOYMENT.md)

---

## Getting Help

- **Documentation**: Check the `/docs` folder
- **API Docs**: http://localhost:8000/docs
- **Issues**: Report bugs on GitHub
- **Email**: support@yourcompany.com

---

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Generate strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Configure HTTPS/SSL
- [ ] Set DEBUG=false in production
- [ ] Enable 2FA for admin users
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Review CORS origins
- [ ] Implement rate limiting
- [ ] Enable logging and monitoring

---

**Installation Complete! 🎉**

You're now ready to start using the Freight Forwarding Automation System.
