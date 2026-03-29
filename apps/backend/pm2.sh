
echo "Starting PM2 manager..."

pm2 stop openfile || true

pm2 start bun --name openfile -- index.ts

echo "Started services..."

pm2 logs
