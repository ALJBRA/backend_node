// tests/auth.test.js
const request = require("supertest");
const app = require("../src/app");
const { faker } = require("@faker-js/faker");

describe("Rotas de autenticação", () => {
  let token = "";
  const mocToken = faker.string.uuid();
  let user;

  // Cria um usuário antes de todos os testes
  beforeAll(async () => {
    user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // Registra o usuário no sistema
    await request(app).post("/auth/register").send(user);

    // Faz login para obter token válido
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    token = res.body.data.token;
  });

  // ------------------ REGISTRO ------------------
  describe("Registro", () => {
    it("deve retornar erro ao tentar registrar um e-mail já existente", async () => {
      const res = await request(app).post("/auth/register").send(user);

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: "error",
        message: "An error occurred",
        error: "The email is already in use",
      });
    });
  });

  // ------------------ LOGIN ------------------
  describe("Login", () => {
    it("deve fazer login e retornar um token", async () => {
      const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: user.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: "success",
        message: "Login successful",
        data: {
          token: expect.any(String),
        },
      });
    });

    it("deve retornar erro ao tentar login com senha inválida", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: user.email, password: "senhaerrada" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: "error",
        message: "An error occurred",
        error: "Invalid email or password",
      });
    });
  });

  // ------------------ PERFIL ------------------
  describe("Perfil", () => {
    it("deve retornar os dados do usuário autenticado", async () => {
      const res = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: "success",
        message: "User authenticated successfully",
        data: {
          name: user.name,
          email: user.email,
        },
      });
      expect(res.body.data).toHaveProperty("id");
    });

    it("deve retornar erro ao acessar sem token válido", async () => {
      const res = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${mocToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toMatchObject({
        status: "error",
        message: expect.stringMatching(/^(Unauthorized|jwt malformed)$/),
        error: {
          name: "JsonWebTokenError",
          message: expect.stringMatching(
            /^(Invalid or blacklisted token|jwt malformed)$/
          ),
        },
      });
    });
  });

  // ------------------ SENHA ------------------
  describe("Senha", () => {
    it("deve solicitar redefinição de senha", async () => {
      const res = await request(app)
        .post("/auth/forget-password")
        .send({ email: user.email });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("deve retornar erro ao tentar redefinir senha de usuário inexistente", async () => {
      const res = await request(app)
        .post("/auth/forget-password")
        .send({ email: "inexistente@example.com" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: "error",
        message: "An error occurred",
        error: "User not found",
      });
    });
  });

  // ------------------ LOGOUT ------------------
  describe("Logout", () => {
    it("deve fazer logout", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("deve retornar erro ao tentar logout sem token válido", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${faker.string.uuid()}`); // token inválido aleatório

      expect(res.statusCode).toBe(401);
      expect(res.body).toMatchObject({
        status: "error",
        message: expect.stringMatching(/^(Unauthorized|jwt malformed)$/),
        error: {
          name: "JsonWebTokenError",
          message: expect.stringMatching(
            /^(Invalid or blacklisted token|jwt malformed)$/
          ),
        },
      });
    });
  });
});
