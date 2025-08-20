#!/bin/sh

echo "🔄 Aguardando banco de dados em ${MYSQL_HOST}:${MYSQL_PORT}..."
until nc -z "$MYSQL_HOST" "$MYSQL_PORT"; do
  echo "⏳ Banco de dados não está pronto ainda..."
  sleep 2
done
echo "✅ Banco de dados disponível!"

echo "🚧 Executando migrações e criação do banco (se necessário)..."
sh scripts/migrate.sh || {
  echo "❌ Falha nas migrações."
  exit 1
}

echo "🚀 Iniciando aplicação..."
exec npm run start
