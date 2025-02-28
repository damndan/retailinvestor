
// API functions for fetching stock prices

// Fetch current stock price from Yahoo Finance API
export const fetchStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    // Using Yahoo Finance API to fetch stock data
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data.chart?.error || !data.chart?.result?.[0]) {
      console.warn('API error or no data:', data);
      throw new Error('Failed to get stock data');
    }
    
    const result = data.chart.result[0];
    const quote = result.meta;
    const price = quote.regularMarketPrice || 0;
    const previousClose = quote.previousClose || 0;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
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

// Optional: Add function to fetch historical data
export const fetchHistoricalData = async (symbol: string, period = '1mo'): Promise<any> => {
  try {
    // Using Yahoo Finance API to fetch historical data
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${period}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.chart.result[0];
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};
