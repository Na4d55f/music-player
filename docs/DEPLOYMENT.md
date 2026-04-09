# Deployment Guide

## Option 1: Docker Compose (Recommended)

```bash
# 1. Set environment variables
cp .env.example .env
# Edit .env

# 2. Build and start
docker-compose up -d

# 3. Check logs
docker-compose logs -f
```

---

## Option 2: Railway

1. Create a Railway project
2. Add a MongoDB service from Railway marketplace
3. Deploy backend:
   - Connect your GitHub repo
   - Set root directory to `/backend`
   - Add environment variables from `.env.example`
4. Deploy frontend:
   - Add another service, root directory `/frontend`
   - Set `VITE_API_URL` to your backend Railway URL + `/api`

---

## Option 3: Heroku

```bash
# Backend
heroku create musicstream-api
heroku addons:create mongolab
heroku config:set JWT_SECRET=<secret> LASTFM_API_KEY=<key>
git subtree push --prefix backend heroku main

# Frontend (Netlify or Vercel)
cd frontend
npm run build
# Deploy the dist/ folder
```

---

## Option 4: VPS (Ubuntu)

```bash
# 1. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install MongoDB
sudo apt-get install -y mongodb

# 3. Install PM2
npm install -g pm2

# 4. Clone repo
git clone <repo> /var/www/musicstream
cd /var/www/musicstream

# 5. Setup backend
cd backend
npm install --production
cp .env.example .env  # configure

# 6. Start with PM2
pm2 start server.js --name musicstream-api
pm2 startup
pm2 save

# 7. Build and serve frontend with Nginx
cd ../frontend
npm install && npm run build
# Copy dist/ to Nginx web root
sudo cp -r dist/* /var/www/html/

# 8. Nginx config
sudo nano /etc/nginx/sites-available/musicstream
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables for Production

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/musicplayer
JWT_SECRET=<generate with: openssl rand -base64 64>
FRONTEND_URL=https://your-domain.com
```

Generate a secure JWT secret:
```bash
openssl rand -base64 64
```
