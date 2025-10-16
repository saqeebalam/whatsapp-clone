# WhatsApp Clone - AWS EC2 Deployment Guide

## Complete Deployment on Single EC2 Instance

This guide will help you deploy the entire WhatsApp clone (Frontend + Backend + MongoDB) on a single AWS EC2 instance.

---

## Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance

2. **Configure Instance:**
   - **Name:** whatsapp-clone-server
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type:** t2.medium (recommended) or t2.micro (minimum)
   - **Key Pair:** Create new or use existing (download .pem file)
   - **Network Settings:**
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere (0.0.0.0/0)
     - Allow HTTPS (port 443) from anywhere (0.0.0.0/0)
     - Allow Custom TCP (port 3000) from anywhere (for testing)
     - Allow Custom TCP (port 8001) from anywhere (for testing)
   - **Storage:** 20 GB (minimum)

3. **Launch Instance** and wait until status is "Running"

4. **Note down:**
   - Public IPv4 address (e.g., 54.123.45.67)
   - Public DNS (e.g., ec2-54-123-45-67.compute-1.amazonaws.com)

---

## Step 2: Connect to EC2 Instance

```bash
# On your local machine
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Step 3: Install Dependencies on EC2

### 3.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Node.js & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x.x
npm --version
```

### 3.3 Install Yarn
```bash
sudo npm install -g yarn
yarn --version
```

### 3.4 Install Python & pip
```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version  # Should show 3.10+
```

### 3.5 Install MongoDB
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod  # Should show "active (running)"
```

### 3.6 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Step 4: Transfer Application Code to EC2

### Option A: Using Git (Recommended)
```bash
# On EC2 instance
cd /home/ubuntu
git clone YOUR_GITHUB_REPO_URL whatsapp-clone
cd whatsapp-clone
```

### Option B: Using SCP (If no Git)
```bash
# On your local machine (in project directory)
tar -czf whatsapp-clone.tar.gz backend/ frontend/ package.json
scp -i your-key.pem whatsapp-clone.tar.gz ubuntu@YOUR_EC2_IP:/home/ubuntu/

# On EC2 instance
cd /home/ubuntu
tar -xzf whatsapp-clone.tar.gz
```

### Option C: Manual File Copy
Copy these directories to EC2:
- `/app/backend/` → `/home/ubuntu/whatsapp-clone/backend/`
- `/app/frontend/` → `/home/ubuntu/whatsapp-clone/frontend/`

---

## Step 5: Configure Environment Variables

### 5.1 Backend Configuration
```bash
cd /home/ubuntu/whatsapp-clone/backend
nano .env
```

Add the following:
```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=whatsapp_clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Save and exit (Ctrl+X, Y, Enter)

### 5.2 Frontend Configuration
```bash
cd /home/ubuntu/whatsapp-clone/frontend
nano .env
```

Add the following (replace with your EC2 public IP or domain):
```env
REACT_APP_BACKEND_URL=http://YOUR_EC2_PUBLIC_IP
```

Or if using domain:
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Save and exit

---

## Step 6: Install Application Dependencies

### 6.1 Install Backend Dependencies
```bash
cd /home/ubuntu/whatsapp-clone/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 6.2 Install Frontend Dependencies
```bash
cd /home/ubuntu/whatsapp-clone/frontend
yarn install
```

---

## Step 7: Build Frontend for Production

```bash
cd /home/ubuntu/whatsapp-clone/frontend
yarn build
```

This creates an optimized production build in `frontend/build/` directory.

---

## Step 8: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/whatsapp-clone
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # Or your domain name

    # Frontend - Serve React build
    location / {
        root /home/ubuntu/whatsapp-clone/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to FastAPI
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/whatsapp-clone /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## Step 9: Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/whatsapp-backend.service
```

Add the following:

```ini
[Unit]
Description=WhatsApp Clone Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/whatsapp-clone/backend
Environment="PATH=/home/ubuntu/whatsapp-clone/backend/venv/bin"
ExecStart=/home/ubuntu/whatsapp-clone/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable whatsapp-backend
sudo systemctl start whatsapp-backend
sudo systemctl status whatsapp-backend  # Should show "active (running)"
```

---

## Step 10: Test the Deployment

1. **Open browser and go to:**
   ```
   http://YOUR_EC2_PUBLIC_IP
   ```

2. **You should see the WhatsApp login/signup page**

3. **Test the flow:**
   - Create an account
   - Login
   - Start a conversation
   - Send messages

---

## Step 11: (Optional) Setup SSL Certificate with Let's Encrypt

### Prerequisites:
- You need a domain name pointed to your EC2 IP

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Certbot will automatically update Nginx config
# Follow the prompts and select redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL setup, update frontend `.env`:
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Rebuild frontend:
```bash
cd /home/ubuntu/whatsapp-clone/frontend
yarn build
```

---

## Useful Commands

### Check Service Status
```bash
# Backend
sudo systemctl status whatsapp-backend

# MongoDB
sudo systemctl status mongod

# Nginx
sudo systemctl status nginx
```

### View Logs
```bash
# Backend logs
sudo journalctl -u whatsapp-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Restart Services
```bash
sudo systemctl restart whatsapp-backend
sudo systemctl restart nginx
sudo systemctl restart mongod
```

### Update Application Code
```bash
cd /home/ubuntu/whatsapp-clone

# Pull latest code (if using git)
git pull

# Rebuild frontend
cd frontend
yarn build

# Restart backend
sudo systemctl restart whatsapp-backend
```

---

## Security Recommendations

1. **Change default ports in Security Group** after testing
2. **Use SSH key authentication only** (disable password auth)
3. **Setup firewall (UFW):**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
4. **Secure MongoDB:**
   ```bash
   sudo nano /etc/mongod.conf
   # Add authentication
   ```
5. **Regular backups:**
   ```bash
   mongodump --db whatsapp_clone --out /backup/$(date +%Y%m%d)
   ```

---

## Mobile Access

Once deployed:
1. Open browser on Android phone
2. Go to: `http://YOUR_EC2_IP` or `https://yourdomain.com`
3. Tap menu (⋮) → "Add to Home screen"
4. Use as native-like app!

---

## Troubleshooting

### Backend not starting:
```bash
cd /home/ubuntu/whatsapp-clone/backend
source venv/bin/activate
python3 server.py  # Run manually to see errors
```

### Frontend not loading:
```bash
sudo nginx -t  # Test Nginx config
ls /home/ubuntu/whatsapp-clone/frontend/build/  # Check build exists
```

### MongoDB connection issues:
```bash
sudo systemctl status mongod
mongo  # Connect to MongoDB shell
```

---

## Estimated Costs

- **t2.micro (1 vCPU, 1GB RAM):** ~$8-10/month (Free tier: 750 hours/month)
- **t2.medium (2 vCPU, 4GB RAM):** ~$33/month
- **Data Transfer:** First 100 GB/month free

**Recommendation:** Start with t2.micro for testing, upgrade to t2.small or t2.medium if needed.

---

## Summary

✅ Single EC2 instance hosting:
- React frontend (served by Nginx)
- FastAPI backend (running on port 8001)
- MongoDB database (local instance)
- Nginx as reverse proxy

🌐 Access from anywhere including mobile devices!
