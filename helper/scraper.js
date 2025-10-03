import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

export const scrapeProduct = async (productUrl) => {
     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
     const page = await browser.newPage();
     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

     await page.goto(productUrl, { waitUntil: 'networkidle2' });

     const data = await page.evaluate(() => {
          return {
               price: document.querySelector(".a-price-whole")?.innerText,
               title: document.querySelector("#productTitle")?.innerText,
               image: document.querySelector("#landingImage")?.getAttribute("src")
          };
     });

     console.log('Scraped data:', data);

     let cleaned = data.price.replace(/[^\d.,]/g, '');

     if (cleaned.includes(',')) {
          cleaned = cleaned.replace(',', '.');
     }

     const priceValue = parseFloat(cleaned);

     await browser.close();
     return { ...data, priceValue };
};
