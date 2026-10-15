#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/atu-frontend

if [[ $EUID -ne 0 ]]; then
  echo 'CHYBA: Spusti cez sudo.'
  exit 1
fi

if [[ ! -f docker-compose.yml ]]; then
  echo 'CHYBA: Chýba docker-compose.yml.'
  exit 1
fi

docker compose config --quiet

if [[ "${1:-}" == '--check' ]]; then
  docker compose ps
  docker exec atu_frontend id
  curl --fail --silent --show-error --output /dev/null http://127.0.0.1:3000/
  echo 'KONTROLA OK'
  exit 0
fi

if [[ $# -ne 0 ]]; then
  echo 'Použitie: sudo ./deploy.sh [--check]'
  exit 2
fi

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo 'CHYBA: Repozitár má neupratané sledované zmeny. Najskôr ich zosúlaď s Gitom.'
  exit 1
fi

echo 'Aktualizujem produkčný main...'
GIT_TERMINAL_PROMPT=0 git pull --ff-only origin main

echo 'Zostavujem nový obraz s Docker cache (bez odstavenia webu)...'
docker compose build

echo 'Prepínam na nový kontajner...'
docker compose up -d --no-deps --no-build --force-recreate

echo 'Overujem spustenie...'
docker compose ps
docker exec atu_frontend id
curl --retry 8 --retry-delay 2 --retry-connrefused --fail --silent --show-error --output /dev/null http://127.0.0.1:3000/
echo 'DEPLOY OK'
