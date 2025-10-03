import { scrapeProduct } from '../helper/scraper.js';
import prisma from '../prisma/prisma.js';

export default class ProductsService {
     createProduct = async (userId, url, targetPrice) => {
          const scraped = await scrapeProduct(url);
          const product = await prisma.product.create({
               data: { url, targetPrice, userId, currentPrice: scraped.priceValue, name: scraped.title, image: scraped.image },
          });
          await prisma.priceHistory.create({
               data: { price: scraped.priceValue, productId: product.id },
          });
          return product;
     }
     getProducts = async (userId) => {
          const products = await prisma.product.findMany({
               include: { priceHistory: true },
               where: { userId: Number(userId) },
          });
          return products;
     }
     getProductById = async (userId, id) => {
          const product = await prisma.product.findFirst({
               where: { id: Number(id), userId: Number(userId) },
               include: { priceHistory: true },
          });
          return product;
     }
     deleteProductById = async (userId, id) => {
          await prisma.priceHistory.deleteMany({
               where: { productId: Number(id) },
          });
          await prisma.product.deleteMany({
               where: { id: Number(id), userId: Number(userId) },
          });
     }
}