#!/bin/sh

docker compose pull
docker compose up -d --force-recreate
docker system prune -a -f
