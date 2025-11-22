# Deployment Guide
## Freight Forwarding Automation System

This guide covers deploying the Freight Forwarding Automation System to production environments.

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [VPS Deployment](#vps-deployment)
3. [Local Server Deployment](#local-server-deployment)
4. [SSL/HTTPS Setup](#sslhttps-setup)
5. [Production Configuration](#production-configuration)
6. [Backup Strategy](#backup-strategy)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Deployment Options

### Option A: VPS Deployment (Cloud)
**Recommended for**: Remote access, scalability, automatic backups

**Providers**:
- DigitalOcean (Bangalore datacenter)
- AWS Lightsail (Mumbai region)
- Linode (Mumbai)
- Hetzner Cloud
- Vultr

**Cost**: ₹2,500-6,000/month for 4GB-8GB RAM VPS

### Option B: Local Server Deployment (On-Premise)
**Recommended for**: Data control, lower ongoing costs

**Requirements**:
- Ubuntu Server 22.04 LTS
- Minimum: 4 cores, 8GB RAM, 100GB SSD
- Static IP or DDNS
- UPS for power backup

**Cost**: One-time hardware cost + ₹1,500-2,500/month (electricity + internet)

---

## VPS Deployment

### Step 1: Choose and Setup VPS

#### DigitalOcean Example

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select plan: 4GB RAM, 2 vCPUs ($24/month)
   - Choose Bangalore datacenter
   - Add SSH key

2. **Initial Server Setup**

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Setup SSH for new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Exit and login as deploy user
exit
ssh deploy@your-server-ip
```

### Step 2: Install Dependencies

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login to apply group changes
exit
ssh deploy@your-server-ip
```

### Step 3: Deploy Application

```bash
# Clone repository
cd /home/deploy
git clone https://github.com/yourcompany/freight-forwarding-system.git
cd freight-forwarding-system

# Create production environment file
cp .env.example .env
nano .env
```

**Important Production Settings:**

```env
# Application
APP_ENV=production
DEBUG=false
SECRET_KEY=<generate-strong-32-char-key>
JWT_SECRET_KEY=<generate-strong-32-char-key>

# Database
DB_PASSWORD=<strong-random-password>

# Allowed origins
CORS_ORIGINS=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASSWORD=<app-specific-password>

# Security
ENABLE_2FA=true
```

```bash
# Build and start services
docker-compose up -d

# Initialize database
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.initial_data

# Check services
docker-compose ps
```

### Step 4: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/freight
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host $host;
    }

    location /uploads/ {
        alias /home/deploy/freight-forwarding-system/uploads/;
        expires 30d;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/freight /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup Firewall

```bash
# Setup UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts and enter your email

# Test automatic renewal
sudo certbot renew --dry-run
```

Certbot automatically configures Nginx for HTTPS and sets up auto-renewal.

### Manual SSL Certificate

If using a purchased SSL certificate:

```bash
# Copy certificates to server
scp cert.pem deploy@your-server-ip:/home/deploy/ssl/
scp key.pem deploy@your-server-ip:/home/deploy/ssl/

# Update Nginx configuration
sudo nano /etc/nginx/sites-available/freight
```

Add SSL configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /home/deploy/ssl/cert.pem;
    ssl_certificate_key /home/deploy/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Local Server Deployment

### Hardware Requirements

**Minimum:**
- Intel i5 10th gen or equivalent
- 8GB RAM
- 100GB SSD
- Gigabit Ethernet

**Recommended:**
- Intel i7 10th gen or equivalent
- 16GB RAM
- 250GB SSD
- UPS (1000VA or higher)

### Step 1: Install Ubuntu Server

1. Download Ubuntu Server 22.04 LTS
2. Create bootable USB
3. Install on dedicated machine
4. Choose static IP during installation

### Step 2: Network Setup

```bash
# Configure static IP (if not done during install)
sudo nano /etc/netplan/00-installer-config.yaml
```

```yaml
network:
  ethernets:
    enp0s3:  # Replace with your interface name
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
  version: 2
```

```bash
# Apply network configuration
sudo netplan apply
```

### Step 3: Port Forwarding (Router Configuration)

Forward these ports to your server IP:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH - optional, use VPN instead)

### Step 4: Dynamic DNS (if no static public IP)

Use services like:
- No-IP (free)
- DuckDNS (free)
- DynDNS

```bash
# Install DDNS client (example: ddclient)
sudo apt install ddclient -y

# Configure
sudo nano /etc/ddclient.conf
```

### Step 5: Deploy Application

Follow same steps as VPS deployment (Docker, Nginx, SSL).

---

## Production Configuration

### Environment Variables

**Security Checklist:**

```env
# ✅ Must Change
SECRET_KEY=<minimum-32-characters-random>
JWT_SECRET_KEY=<minimum-32-characters-random>
DB_PASSWORD=<strong-database-password>

# ✅ Must Set Correctly
APP_ENV=production
DEBUG=false
CORS_ORIGINS=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com

# ✅ Production Settings
ENABLE_2FA=true
LOG_LEVEL=WARNING
```

### Database Configuration

```bash
# Optimize PostgreSQL for production
sudo nano /var/lib/docker/volumes/freight_postgres_data/_data/postgresql.conf
```

```conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

### Redis Configuration

```bash
# Production redis.conf
# In docker-compose.yml, add:
command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

---

## Backup Strategy

### Automated Daily Backups

Create backup script:

```bash
sudo nano /home/deploy/backup.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/home/deploy/freight-forwarding-system"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker-compose -f $PROJECT_DIR/docker-compose.yml exec -T db \
    pg_dump -U postgres freight_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Files backup (uploads)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $PROJECT_DIR/uploads .

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /home/deploy/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

### Cloud Backup (Optional)

```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure cloud provider (Google Drive, Backblaze, etc.)
rclone config

# Add to backup script
rclone copy $BACKUP_DIR remote:backups/freight-system
```

### Restore from Backup

```bash
# Stop services
cd /home/deploy/freight-forwarding-system
docker-compose down

# Restore database
gunzip -c /home/deploy/backups/db_20240101_020000.sql.gz | \
    docker-compose exec -T db psql -U postgres freight_db

# Restore files
tar -xzf /home/deploy/backups/uploads_20240101_020000.tar.gz -C uploads/

# Start services
docker-compose up -d
```

---

## Monitoring & Maintenance

### System Monitoring

**Install monitoring tools:**

```bash
# Install htop
sudo apt install htop -y

# Install netdata (real-time monitoring)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Access Netdata dashboard at: http://your-server-ip:19999

### Application Logs

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery_worker

# Check specific service
docker-compose logs --tail=100 backend

# Export logs
docker-compose logs > app_logs_$(date +%Y%m%d).log
```

### Performance Optimization

```bash
# Check Docker container resources
docker stats

# Check disk usage
df -h
docker system df

# Clean up unused Docker resources
docker system prune -a --volumes
```

### Database Maintenance

```bash
# Vacuum database (monthly)
docker-compose exec db psql -U postgres -d freight_db -c "VACUUM ANALYZE;"

# Check database size
docker-compose exec db psql -U postgres -c "\l+"

# Check table sizes
docker-compose exec db psql -U postgres -d freight_db -c "\dt+"
```

### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd /home/deploy/freight-forwarding-system
docker-compose pull
docker-compose up -d --build

# Check for security vulnerabilities
docker scan freight_backend
docker scan freight_frontend
```

### Auto-Update Script

```bash
sudo nano /home/deploy/update.sh
```

```bash
#!/bin/bash

cd /home/deploy/freight-forwarding-system

# Pull latest code
git pull origin main

# Update dependencies
docker-compose pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run migrations
docker-compose exec backend alembic upgrade head

echo "Update completed: $(date)"
```

```bash
chmod +x /home/deploy/update.sh

# Schedule weekly updates (Sundays at 3 AM)
crontab -e
```

Add:
```
0 3 * * 0 /home/deploy/update.sh >> /home/deploy/update.log 2>&1
```

---

## Troubleshooting Production Issues

### High Memory Usage

```bash
# Restart memory-intensive services
docker-compose restart backend celery_worker

# Check memory per container
docker stats --no-stream

# Increase server RAM if needed
```

### Database Connection Pool Exhausted

```bash
# Increase max_connections in PostgreSQL
docker-compose exec db psql -U postgres -c "ALTER SYSTEM SET max_connections = 200;"
docker-compose restart db
```

### Slow Response Times

```bash
# Check slow queries
docker-compose exec db psql -U postgres -d freight_db

# Enable slow query log
ALTER DATABASE freight_db SET log_min_duration_statement = 1000;

# Check logs
docker-compose logs db | grep "duration:"
```

### SSL Certificate Renewal Failed

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Renew manually
sudo certbot renew --standalone

# Restart Nginx
sudo systemctl start nginx
```

---

## Production Checklist

Before going live:

- [ ] All default passwords changed
- [ ] Strong SECRET_KEY and JWT_SECRET_KEY set
- [ ] DEBUG=false in production
- [ ] HTTPS/SSL configured and working
- [ ] Firewall configured (UFW/iptables)
- [ ] Automated backups configured and tested
- [ ] Restore procedure tested
- [ ] Monitoring tools installed
- [ ] Log rotation configured
- [ ] 2FA enabled for admin users
- [ ] Email notifications working
- [ ] Domain DNS configured correctly
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Error pages customized
- [ ] Health check endpoints working
- [ ] Documentation reviewed
- [ ] Users trained
- [ ] Support contact information updated

---

## Scaling Considerations

### Horizontal Scaling (Multiple Servers)

When traffic grows:

1. **Load Balancer**: Use Nginx or HAProxy
2. **Separate Database Server**: Dedicated PostgreSQL server
3. **Redis Cluster**: For distributed caching
4. **CDN**: CloudFlare for static assets
5. **Object Storage**: S3/MinIO for file uploads

### Vertical Scaling (Bigger Server)

Upgrade VPS plan:
- 8GB → 16GB RAM
- 2 vCPUs → 4 vCPUs
- 100GB → 250GB storage

---

## Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review documentation: `/docs`
- Contact support: support@yourcompany.com

---

**Deployment Complete! 🚀**

Your Freight Forwarding Automation System is now running in production.
