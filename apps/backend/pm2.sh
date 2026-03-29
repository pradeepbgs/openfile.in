
echo "[PM2] Deploying backend..."

# Navigate to the backend directory (just in case)
cd "$(dirname "$0")"

# Delete the existing process(es) to avoid ID accumulation
# This cleans up all IDs with the name 'openfile'
pm2 delete openfile || true

# Give the OS a moment to fully release the port
echo "[PM2] Waiting for port cleanup..."
sleep 1

# Start a fresh process
echo "[PM2] Starting new process..."
pm2 start bun --name openfile -- index.ts

# Persist the process list
pm2 save

echo "[PM2] Backend is up and running."
