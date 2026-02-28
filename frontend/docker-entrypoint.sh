#!/bin/sh
set -e
# Cloud Run usa PORT=8080; localmente usamos 80
export PORT=${PORT:-80}
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
