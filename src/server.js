const app = require("./app");
const { testConnection } = require("./db");
const port = process.env.PORT || 3001;

(async () => {
  await testConnection(); // Testar a conexão com o banco de dados
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
