# Projeto Backend em Node.js

Este é um projeto de backend construído com Node.js, utilizando Sequelize para gerenciamento de banco de dados e JWT para autenticação. Este projeto serve como um ponto de partida para novos projetos.

## Estrutura do Projeto

- `config`: Configurações gerais do projeto
- `migrations`: Scripts de migração do banco de dados
- `seeders`: Scripts para popular o banco de dados com dados iniciais
- `src`
  - `controllers`: Controladores que lidam com as requisições e respostas
  - `dtos`: Objetos de Transferência de Dados
  - `middlewares`: Middlewares para manipulação das requisições
  - `models`: Definições dos modelos de dados
  - `repositories`: Repositórios para acesso aos dados
  - `routes`: Definição das rotas da API
  - `services`: Serviços que contêm a lógica de negócios
  - `utils`: Utilitários gerais
  - `validations`: Validações de dados
- `app.js`: Configuração do aplicativo
- `db.js`: Configuração do banco de dados
- `server.js`: Inicialização do servidor

## Configuração

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```env
PORT=3001
NODE_ENV=development

# Base Urls
BASE_URL=http://localhost:3001
FRONT_URL=http://localhost:3000

# Banco
MYSQL_DATABASE=default
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=testuser
MYSQL_PASSWORD=testpass
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DIALECT=mysql

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=testpass

# Segurança
JWT_SECRET=mytestsecret
JWT_EXPIRES=24000
AES_KEY=12345678901234567890123456789012

# CORS
CORS_ORIGIN=*

# Mailtrap
MAILTRAP_HOST=smtp.mailersend.net
MAILTRAP_PORT=587
MAILTRAP_USER=user
MAILTRAP_PASS=passwd
EMAIL_FROM=user@domain.com
SEND_EMAIL_ENABLED=false

# Default Admin User
DEFAULT_NAME=Admin
DEFAULT_PASSWORD=Admin123
DEFAULT_EMAIL=admin@email.com
```

## Instalação

1. Clone o repositório:
   git clone https://github.com/ALJBRA/backend_node.git
   cd seu-repositorio

2. Instale as dependências:
   npm install

3. Docker

   - Produção: docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.override.yml up -d
   - Desenvolvimento: docker compose --env-file .env.test -f docker-compose.yml -f docker-compose.test.override.yml up -d

4. Crie o banco de dados:
   npm run createdb

5. Execute as migrações:
   npm run migratedb

6. Popule o banco de dados:
   npm run seeddb

## Uso

# Para iniciar o servidor em ambiente de desenvolvimento com nodemon:

npm run dev

# Ambiente de Produção

npm start

## Scripts Disponíveis

npm start: Inicia o servidor
npm run dev: Inicia o servidor em modo de desenvolvimento
npm run createdb: Cria o banco de dados
npm run migratedb: Executa as migrações do banco de dados
npm run seeddb: Popula o banco de dados com dados iniciais

## Tests

docker compose exec backend npm run test

# Contribuindo

Sinta-se à vontade para abrir issues e pull requests. Agradecemos suas contribuições!

## License

Este projeto está licenciado sob a [licença MIT](https://opensource.org/licenses/MIT).
