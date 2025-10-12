
echo "Starting PM2 manager..."

pm2 restart pm2.config.cjs

echo "Started services..."

pm2 logs
