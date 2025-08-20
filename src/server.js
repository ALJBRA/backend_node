const app = require("./app");
const { testConnection } = require("./db");
const { connectRedis } = require("./redis");
const port = process.env.PORT || 3001;

(async () => {
  await testConnection();
  await connectRedis();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
