#!/bin/sh

sudo docker compose pull \
&& sudo docker compose up -d --force-recreate \
&& sudo docker image prune -f
