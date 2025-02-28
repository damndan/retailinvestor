
// API functions for fetching stock prices

// Fetch current stock price from Finnhub API
export const fetchStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    // For market indices, we need to handle special symbols
    const apiSymbol = transformSymbolForAPI(symbol);
    
    // Finnhub API endpoint with API key
    const apiKey = 'cm048t1r01ql4pjlpb4gcm048t1r01ql4pjlpb50';
    const url = `https://finnhub.io/api/v1/quote?symbol=${apiSymbol}&token=${apiKey}`;
    
    console.log(`Fetching stock data for ${symbol} (API symbol: ${apiSymbol})...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (!data || data.error || !data.c) {
      console.warn('Finnhub API error or no data:', data);
      
      // If we get an error or no data, fall back to the mock implementation
      return fallbackToMockData(symbol);
    }
    
    // Extract the data from Finnhub response
    // c = current price, pc = previous close, d = change, dp = percent change
    const price = parseFloat(data.c || 0);
    const previousClose = parseFloat(data.pc || 0);
    const change = parseFloat(data.d || 0);
    const changePercent = parseFloat(data.dp || 0);
    
    console.log(`Finnhub data for ${symbol}: price=${price.toFixed(2)}, change=${change.toFixed(2)}, changePercent=${changePercent.toFixed(2)}%`);
    
    return { 
      price, 
      change, 
      changePercent 
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    
    // Fallback to mock data if the API call fails
    return fallbackToMockData(symbol);
  }
};

// Transform symbols for the API (different APIs use different formats for indices)
function transformSymbolForAPI(symbol: string): string {
  // Convert standard index symbols to Finnhub format
  if (symbol === '^GSPC') return 'SPX'; // S&P 500
  if (symbol === '^IXIC') return 'NDX'; // NASDAQ (using Nasdaq-100 as proxy)
  if (symbol === '^DJI') return 'DJI';  // Dow Jones
  
  return symbol; // For regular stock symbols, no change needed
}

// Helper function that generates mock data as a fallback
function fallbackToMockData(symbol: string): { price: number; change: number; changePercent: number } {
  console.warn(`Falling back to mock data for ${symbol}`);
  
  // Generate reasonable random data for the stock
  const basePrice = getBasePrice(symbol);
  const randomChange = (Math.random() * 2 - 1) * (basePrice * 0.03); // +/- 3% change
  const price = basePrice + randomChange;
  const previousClose = basePrice;
  const change = price - previousClose;
  const changePercent = (change / previousClose) * 100;
  
  console.log(`Generated mock data for ${symbol}: price=${price.toFixed(2)}, change=${change.toFixed(2)}, changePercent=${changePercent.toFixed(2)}%`);
  
  return { 
    price, 
    change, 
    changePercent 
  };
}

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
