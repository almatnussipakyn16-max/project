# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)
- Email service (SMTP credentials)
- Payment gateway account (Stripe)

## Production Deployment

### 1. Server Setup

#### Minimum Requirements
- 2 CPU cores
- 4GB RAM
- 50GB SSD storage
- Ubuntu 22.04 LTS (recommended)

#### Install Docker
\`\`\`bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
\`\`\`

### 2. Clone and Configure

\`\`\`bash
git clone <repository-url>
cd project
\`\`\`

#### Backend Configuration
Create `backend/.env`:
\`\`\`bash
# Security
SECRET_KEY=<generate-strong-random-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=restaurant_prod
DB_USER=postgres
DB_PASSWORD=<strong-password>
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Celery
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
\`\`\`

#### Frontend Configuration
Create `frontend/.env`:
\`\`\`bash
VITE_API_URL=https://api.yourdomain.com
\`\`\`

### 3. Deploy with Docker

\`\`\`bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
\`\`\`

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/restaurant-platform`:

\`\`\`nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /path/to/project/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /path/to/project/backend/media/;
    }
}
\`\`\`

Enable the site:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/restaurant-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### 5. SSL Certificate (Let's Encrypt)

\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

### 6. Monitoring and Logs

#### View logs
\`\`\`bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery
\`\`\`

#### Set up log rotation
Create `/etc/logrotate.d/restaurant-platform`:
\`\`\`
/path/to/project/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
\`\`\`

### 7. Backup Strategy

#### Database Backup
\`\`\`bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres restaurant_prod > /backups/db_$DATE.sql
find /backups -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh
\`\`\`

#### Add to crontab
\`\`\`bash
crontab -e
# Add:
0 2 * * * /usr/local/bin/backup-db.sh
\`\`\`

### 8. Monitoring

#### Install monitoring tools
\`\`\`bash
# Prometheus + Grafana (recommended)
docker run -d --name prometheus -p 9090:9090 prom/prometheus
docker run -d --name grafana -p 3000:3000 grafana/grafana
\`\`\`

### 9. Performance Optimization

#### Enable caching
- Redis already configured for caching
- CDN for static assets (CloudFlare, AWS CloudFront)

#### Database optimization
\`\`\`bash
docker-compose exec backend python manage.py optimize_db
\`\`\`

### 10. Security Hardening

- Keep all dependencies updated
- Enable firewall (UFW)
- Use strong passwords
- Regular security audits
- Monitor logs for suspicious activity
- Enable 2FA for admin accounts

### 11. Troubleshooting

#### Backend not starting
\`\`\`bash
docker-compose logs backend
docker-compose exec backend python manage.py check
\`\`\`

#### Database connection issues
\`\`\`bash
docker-compose exec db psql -U postgres -c "\\l"
\`\`\`

#### Reset everything (CAUTION - deletes data)
\`\`\`bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
\`\`\`

## Maintenance

### Regular Updates
\`\`\`bash
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --noinput
\`\`\`

### Health Checks
- Monitor application logs daily
- Check disk space weekly
- Review database performance monthly
- Update SSL certificates (auto with certbot)

## Support

For issues, contact: support@restaurant-platform.com
