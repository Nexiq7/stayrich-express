import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./prisma/prisma.js";
import { sendMail } from "./helper/email.js";
import { scrapeProduct } from "./helper/scraper.js";
import cron from "node-cron";

import userRoutes from './routes/users.routes.js';
import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use(cors({
     origin: true,
     credentials: true,
}));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
     console.log(`Server running on http://localhost:${process.env.PORT}`);
});

async function runPriceCheck() {
     try {
          console.log("Running price check...");
          const products = await prisma.product.findMany({
               include: { user: true },
          });

          for (const product of products) {
               try {
                    const scraped = await scrapeProduct(product.url);
                    if (!scraped || !scraped.priceValue) continue;

                    await prisma.product.update({
                         where: { id: product.id },
                         data: {
                              currentPrice: scraped.priceValue,
                              name: scraped.title,
                              image: scraped.image,
                         },
                    });

                    await prisma.priceHistory.create({
                         data: {
                              productId: product.id,
                              price: scraped.priceValue,
                         }
                    });

                    if (scraped.priceValue >= product.targetPrice && product.notified) {
                         await prisma.product.update({
                              where: { id: product.id },
                              data: { notified: false },
                         });
                    }

                    if (scraped.priceValue <= product.targetPrice && !product.notified) {
                         await sendMail(scraped, product.url, product.user.email);
                         console.log(`Alert sent to ${product.user.email}`);
                         await prisma.product.update({
                              where: { id: product.id },
                              data: { notified: true },
                         });
                    }
               } catch (err) {
                    console.error(`Error checking product ${product.id}`, err);
               }
          }
          console.log("Price check completed.");
     } catch (err) {
          console.error("Cron job failed:", err);
     }
}

cron.schedule("0 * * * *", () => {
     runPriceCheck();
});
