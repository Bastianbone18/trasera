const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct,
  advancedSearch
} = require("../controllers/product.controller");
const validateFields = require("../middlewares/validateFields");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos tecnológicos en el sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TechProduct:
 *       type: object
 *       required:
 *         - categoria
 *         - marca
 *         - modelo
 *         - precio
 *         - descripcion
 *         - imagenes
 *         - stock
 *         - disponible
 *         - destacado
 *       properties:
 *         categoria:
 *           type: string
 *           example: "Electrónica"
 *         marca:
 *           type: string
 *           example: "Apple"
 *         modelo:
 *           type: string
 *           example: "iPhone 14"
 *         precio:
 *           type: number
 *           example: 999.99
 *         descripcion:
 *           type: string
 *           example: "Smartphone de última generación"
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/iphone14.jpg"]
 *         stock:
 *           type: integer
 *           example: 100
 *         disponible:
 *           type: boolean
 *           default: true
 *         destacado:
 *           type: boolean
 *           default: false
 *         caracteristicas:
 *           type: object
 *           properties:
 *             pantalla:
 *               type: string
 *               example: "6.1 pulgadas"
 *             procesador:
 *               type: string
 *               example: "A15 Bionic"
 *             camara:
 *               type: string
 *               example: "12MP"
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos con filtros opcionales
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtrar por marca (ej. Apple)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría de producto
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TechProduct'
 *       500:
 *         description: Error del servidor
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalles del producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechProduct'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechProduct'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechProduct'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  [
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("marca", "La marca es obligatoria").not().isEmpty(),
    check("modelo", "El modelo es obligatorio").not().isEmpty(),
    check("precio", "El precio debe ser un número válido").isFloat({ gt: 0 }),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("imagenes", "Debe proporcionar al menos una imagen").isArray({ min: 1 }),
    check("stock", "El stock debe ser un número válido").isInt({ min: 0 }),
    check("disponible", "El campo 'disponible' debe ser un valor booleano").isBoolean(),
    check("destacado", "El campo 'destacado' debe ser un valor booleano").isBoolean(),
    check("caracteristicas", "Las características del producto son obligatorias").isObject(),
    validateFields
  ],
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TechProduct'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechProduct'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  [
    check("id", "El ID debe ser válido").isMongoId(),
    validateFields
  ],
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  [
    check("id", "El ID debe ser válido").isMongoId(),
    validateFields
  ],
  deleteProduct
);

module.exports = router;
