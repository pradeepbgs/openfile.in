# 🔧 EC2 Backend Setup Guide (Redis + PostgreSQL + Docker + NGINX)

This guide documents the steps to set up and run the backend project on an AWS EC2 instance with Docker, Redis, PostgreSQL (RDS), and NGINX reverse proxy.

---

## 1. On EC2 Generate and Add SSH Key to GitHub

```bash
ssh-keygen -t rsa -b 4096 -C "kumarpradeepbgs@gmail.com"
cat ~/.ssh/id_rsa.pub
```

* Go to GitHub → Settings → SSH and GPG Keys → New SSH Key
* Paste the contents of `id_rsa.pub` and save

Test connection:

```bash
ssh -T git@github.com
```

---

## 2. Clone the Backend Project

```bash
git clone git@github.com:your-username/openfile-backend.git
cd openfile-backend
```

---

## 3. Install bun on ec2
```bash

sudo apt install unzip && curl -fsSL https://bun.sh/install | bash


```

## 4. Connect to PostgreSQL (AWS RDS)

Ensure `.env` includes:

```env
DATABASE_URL="postgresql://postgres:linuxpradeep@<your-rds-endpoint>:5432/openfile?schema=public"
```

RDS and EC2 are in the same VPC, so no extra configuration was needed.

---

## 5. Install Docker and Redis Locally

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker

```

## 6. Install Redis:

```bash
docker run -d --name redis-server -p 6379:6379 redis
```

Update `.env`:

```env
PRODUCTION=false ( means backend willl use local redis )
then dont need to add - REDIS_URL=redis://localhost:6379
```

---

## 7. Run Tests (Using Bun)

```bash
bun install
bun run test --timeout=12000
```

All routes and upload functionality tested, including:

* Auth checks
* Link creation
* File upload to S3
* Expiry and max upload limits
* JWT token validation

---

## 8. Install and Configure NGINX

```bash
sudo apt install nginx -y
```

Edit the default NGINX site config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and restart:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Make sure EC2's security group allows inbound HTTP (port 80).

---

## in last run backend application
```bash
bun run start 
```
