#!/bin/sh

# Executa criação e migração do banco
npx sequelize-cli db:create || echo "Banco já existe, seguindo..."
npx sequelize-cli db:migrate
