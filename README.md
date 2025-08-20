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
JWT_SECRET=mysecret
JWT_EXPIRES=1800

# Base Urls
BASE_URL=http://localhost:3001

# Banco de dados
DB_NAME=config
DB_USER=root
DB_PWD=devRoot
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=devRoot

#aes key. 32 characters
AES_KEY=21QgUtU6VLUd79Zna354X49Qfe35xMYe

# Origem que pode acessar nosso backend
CORS_ORIGIN=*

MAILTRAP_USER=XXXXXXXXXXXXXX
MAILTRAP_PASS=XXXXXXXXXXXXXX


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

3. Crie o banco de dados:
   npm run createdb

4. Execute as migrações:
   npm run migratedb

5. Popule o banco de dados:
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

# Contribuindo

Sinta-se à vontade para abrir issues e pull requests. Agradecemos suas contribuições!

## License

Este projeto está licenciado sob a [licença MIT](https://opensource.org/licenses/MIT).
