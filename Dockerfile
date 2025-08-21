FROM node:22.14.0-alpine

ARG APP_DIR=/app

# Dependências de build
RUN apk add --no-cache bash curl python3 make g++ shadow

# Cria usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install

COPY . .

RUN chown -R appuser:appgroup ${APP_DIR}
RUN chmod +x docker-entrypoint.sh scripts/migrate.sh

USER appuser

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
