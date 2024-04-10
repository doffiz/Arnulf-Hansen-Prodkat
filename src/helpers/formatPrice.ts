export function formatPrice(price: number) {
    let priceNum = price / 100;
    let priceStr = priceNum.toString();
  
    let priceGroups = [];
    while (priceStr.length > 3) {
      priceGroups.unshift(priceStr.slice(-3));
      priceStr = priceStr.slice(0, -3);
    }
    priceGroups.unshift(priceStr);
  
    let formattedPrice = priceGroups.join(' ');
  
    return formattedPrice;
  }