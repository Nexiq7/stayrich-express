import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export const createProduct = async (req, res) => {
     try {
          const { url, targetPrice } = req.body;

          if (!req.user.id || !url || !targetPrice) {
               return res.status(400).json({ error: "Missing required fields" });
          }
          const product = await productsService.createProduct(req.user.id, url, targetPrice);
          res.status(201).json(product);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to create product" });
     }
}

export const getProducts = async (req, res) => {
     try {
          if (!req.user.id) {
               return res.status(400).json({ error: "Missing user" });
          }
          const products = await productsService.getProducts(req.user.id);
          res.status(200).json(products);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch products" });
     }
}

export const getProductById = async (req, res) => {
     try {
          const { id } = req.params;
          if (!req.user.id || !id) {
               return res.status(400).json({ error: "Missing required fields" });
          }
          const product = await productsService.getProductById(req.user.id, id);
          res.status(200).json(product);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch product" });
     }
}

export const deleteProductById = async (req, res) => {
     try {
          const { id } = req.params;
          if (!req.user.id || !id) {
               return res.status(400).json({ error: "Missing required fields" });
          }
          await productsService.deleteProductById(req.user.id, id);
          res.status(204).send();
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to delete product" });
     }
}