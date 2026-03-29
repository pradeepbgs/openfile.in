
echo "[PM2] Deploying backend..."


pm2 delete openfile || true

echo "[PM2] Waiting for port cleanup..."
sleep 1

echo "[PM2] Starting new process..."
pm2 start bun --name openfile -- index.ts

# Persist the process list
pm2 save

echo "[PM2] Openfile Backend is up and running."
