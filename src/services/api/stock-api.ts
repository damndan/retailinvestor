
// API functions for fetching stock prices

// Fetch current stock price from Alpha Vantage API
export const fetchStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    // Using Alpha Vantage's Global Quote endpoint for current stock data
    // Note: This is a mock implementation that generates realistic data
    // since we don't actually have an API key for Alpha Vantage
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate reasonable random data for the stock
    const basePrice = getBasePrice(symbol);
    const randomChange = (Math.random() * 2 - 1) * (basePrice * 0.03); // +/- 3% change
    const price = basePrice + randomChange;
    const previousClose = basePrice;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    console.log(`Generated stock data for ${symbol}: price=${price.toFixed(2)}, change=${change.toFixed(2)}, changePercent=${changePercent.toFixed(2)}%`);
    
    return { 
      price, 
      change, 
      changePercent 
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

// Helper function to get a base price for a symbol to ensure consistency
function getBasePrice(symbol: string): number {
  // Map common indices to realistic values
  if (symbol === '^GSPC') return 5220.12; // S&P 500
  if (symbol === '^IXIC') return 16420.98; // NASDAQ
  if (symbol === '^DJI') return 39105.73; // Dow Jones
  
  // For regular stocks, generate based on symbol's character codes
  // This ensures the same symbol always gets the same base price
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Generate a price between $10 and $500
  return Math.abs(hash % 490) + 10;
}
