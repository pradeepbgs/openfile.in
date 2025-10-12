
set -e

# Generate SSH Key (user must add to GitHub manually)
# echo "Generating SSH key..."
# ssh-keygen -t rsa -b 4096 -C "kumarpradeepbgs@gmail.com"
# echo "Copy and add the following public key to GitHub SSH settings:"
# cat ~/.ssh/id_rsa.pub

# 2. Clone backend project
# echo "Cloning backend repository..."
# git clone git@github.com:your-username/openfile-backend.git
# cd openfile-backend

# 3. Install Bun
echo "Installing Bun..."
sudo apt install -y unzip
curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH for current session
bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# 4. Update .env file (user must fill in correct values)
echo "Make sure your .env file has the correct DATABASE_URL and PRODUCTION=false"

# 5. Install Docker
echo "Installing Docker..."
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker

# 6. Run Redis container
echo "Starting Redis container..."
docker run -d --name redis-server -p 6379:6379 redis

# 7. Install dependencies and run tests
# echo "Installing dependencies and running tests..."
# bun install
# bun run test --timeout=12000

# 8. Install and configure NGINX
echo "Installing and configuring NGINX..."
sudo apt install -y nginx

cat <<EOF | sudo tee /etc/nginx/sites-available/default
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx

echo "Setup complete. You can now run 'bun run start' to start the backend server."
