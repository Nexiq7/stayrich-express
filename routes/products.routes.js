import express from 'express';
import { createProduct, getProductById, getProducts, deleteProductById } from '../controllers/products.controller.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.post("/", jwtAuth, createProduct);
router.get("/", jwtAuth, getProducts);
router.get("/:id", jwtAuth, getProductById);
router.delete("/:id", jwtAuth, deleteProductById);

export default router;