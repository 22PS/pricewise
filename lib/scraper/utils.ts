import { PriceHistoryItem, Product } from '@/types';
const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
}

export function getLowestPrice(priceList: PriceHistoryItem[], low: number) {
  let lowestPrice = low;

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice) {
      lowestPrice = priceList[i].price;
    }
  }

  return lowestPrice;
}

export const getHighestPrice = (
  priceList: PriceHistoryItem[],
  high: number
) => {
  let highestPrice = high;

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice) {
      highestPrice = priceList[i].price;
    }
  }

  return highestPrice;
};

export function getAveragePrice(priceList: PriceHistoryItem[], avg: number) {
  let averagePrice = avg;
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  averagePrice =
    Math.floor((averagePrice * 2 + sumOfPrices) / (priceList.length + 2)) || 0;
  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(
    currentProduct.priceHistory,
    currentProduct.lowestPrice
  );

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }

  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};
