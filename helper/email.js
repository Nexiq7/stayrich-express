import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


export const sendMail = async (product, productUrl, email) => {
  const msg = {
    to: "zeronflash@gmail.com",
    from: "nexiq.dev@gmail.com",
    subject: `📉 Price Drop Alert: ${product.title}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: #232f3e; color: #fff; padding: 15px;">
        <h2 style="margin: 0; font-size: 20px;">Amazon Price Alert</h2>
      </div>

      <div style="padding: 20px;">
        <h3 style="margin-top: 0; font-size: 18px; color: #111;">${product.title}</h3>
        <img src="${product.image}" alt="Product Image" style="max-width: 200px; display: block; margin: 10px 0;" />

        <p style="font-size: 16px; margin: 10px 0;">
          The price of this product has just dropped to 
          <b style="font-size: 18px; color: #d32f2f;">${product.priceValue}€</b>.
        </p>

        <a href="${productUrl}" target="_blank" 
           style="display: inline-block; background: #ff9900; color: #111; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold; margin-top: 15px;">
          🔗 View on Amazon
        </a>
      </div>

      <div style="background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        You’re receiving this alert because you subscribed to price updates.<br/>
        Product prices may change at any time.
      </div>
    </div>
  `,
  };



  await sgMail
    .send(msg)
    .catch((error) => {
      console.error(error)
    })
}