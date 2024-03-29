import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from './utils';

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    // console.log(response.data);

    const $ = cheerio.load(response.data);

    //Extract the product title
    const title = $('#productTitle').text().trim();
    // console.log(title);

    const currentPrice = extractPrice($('.priceToPay span.a-price-whole'));

    const originalPrice = extractPrice(
      $('.a-size-small.basisPrice span.a-offscreen')
    );
    console.log(originalPrice);
    const outOfStock =
      $('#availability span').text().trim().toLowerCase() ===
      'currently unavailable';

    const images = $('#landingImage').attr('data-a-dynamic-image') || '{}';

    const imageUrls = Object.keys(JSON.parse(images));
    // console.log(imageUrls);

    const currency = extractCurrency($('.a-price-symbol'));

    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

    const data = {
      url,
      currency: currency || '₹',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      isOutOfStock: outOfStock,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: (Number(currentPrice) + Number(originalPrice)) / 2,
    };
    return data;
    // console.log(data);
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
