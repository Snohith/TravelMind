#!/usr/bin/env bash
# Backend API (Spring Boot). H2 file lives in backend/.data so `rm -rf .data` resets.
# Frontend calls it at localhost:8080 — see FRONTEND_URL in CorsConfig for prod.
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-8080}"
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=$PORT" 2>/dev/null \
  || mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=$PORT"
