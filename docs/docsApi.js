/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Gerenciamento de autenticação
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *         password:
 *           type: string
 *           example: senha123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *         password:
 *           type: string
 *           example: senha123
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: joao@email.com
 *     ResetPasswordRequest:
 *       type: object
 *       properties:
 *         newPassword:
 *           type: string
 *           description: Nova senha do usuário
 *           example: novaSenha123
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro na requisição
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verifica o email do usuário
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Retorna as informações do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Solicita redefinição de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordRequest'
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Erro ao processar a solicitação
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Valida um token de redefinição de senha ou redefine a senha do usuário
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         description: Token de redefinição de senha enviado por e-mail
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Sucesso. Retorna "Token valid" se apenas validar o token, ou "Password updated successfully" se redefinir a senha.
 *       400:
 *         description: Erro. O token é inválido, expirado ou outro erro ocorreu.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Encerra a sessão do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */
