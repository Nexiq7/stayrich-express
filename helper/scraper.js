import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

export const scrapeProduct = async (productUrl) => {
     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
     const page = await browser.newPage();

     await page.goto(productUrl, { waitUntil: 'domcontentloaded' });

     const data = await page.evaluate(() => {
          return {
               price: document.querySelector(".a-price-whole")?.innerText,
               title: document.querySelector("#productTitle")?.innerText,
               image: document.querySelector("#landingImage")?.getAttribute("src")
          };
     });

     const cleaned = data.price.replace(/[^\d.,]/g, '');
     const priceValue = parseFloat(cleaned);
     await browser.close();
     return { ...data, priceValue };
}

