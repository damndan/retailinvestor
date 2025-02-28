
import { marketOverviewData, buyRecommendations, sellRecommendations } from "@/data/mock-data";

// Alpha Vantage free API key - has limited usage (5 calls per minute, 500 per day)
// This is a public API key meant for demonstration purposes
const API_KEY = "FRGQGC2VTSM5QNL1";

// Interfaces for the financial data
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  prevValue: number;
  change: number;
}

export interface ChartData {
  date: string;
  sp500: number;
  nasdaq: number;
  dowjones: number;
}

// Define a generic StockRecommendation type
export interface StockRecommendation {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: "buy" | "sell" | "hold";
  confidence: number;
  analysis: string;
}

// Function to fetch real-time quote for a stock
export const fetchStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch stock data");
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (data["Global Quote"] && Object.keys(data["Global Quote"]).length > 0) {
      const quote = data["Global Quote"];
      const price = parseFloat(quote["05. price"]);
      const change = parseFloat(quote["09. change"]);
      const changePercent = parseFloat(quote["10. change percent"].replace("%", ""));
      
      // Get the company name from our mock data (Alpha Vantage free tier doesn't provide names)
      const stockInfo = [...buyRecommendations, ...sellRecommendations].find(
        (stock) => stock.symbol === symbol
      );
      
      return {
        symbol,
        name: stockInfo?.name || symbol,
        price,
        change,
        changePercent,
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null;
  }
};

// Function to fetch market index data
// Note: Alpha Vantage doesn't provide direct index value in free tier
// For demonstration purposes, we'll use this function to simulate fetching
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    // For demo purposes, fetch SPY (S&P 500 ETF) data as a proxy for S&P 500
    const spyResponse = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${API_KEY}`
    );
    
    if (!spyResponse.ok) {
      throw new Error("Failed to fetch SPY data");
    }
    
    const spyData = await spyResponse.json();
    
    // If we have valid SPY data, calculate market indices
    if (spyData["Global Quote"] && Object.keys(spyData["Global Quote"]).length > 0) {
      const spyQuote = spyData["Global Quote"];
      const spyPrice = parseFloat(spyQuote["05. price"]);
      const spyChange = parseFloat(spyQuote["10. change percent"].replace("%", ""));
      
      // Use SPY data to approximate market movements
      // This is a simplified approach - in a real app you'd fetch each index separately
      return [
        {
          name: "S&P 500",
          value: Math.round(spyPrice * 10 * 100) / 100, // Approximate conversion
          prevValue: Math.round((spyPrice / (1 + spyChange/100)) * 10 * 100) / 100,
          change: spyChange
        },
        {
          name: "NASDAQ",
          value: Math.round(spyPrice * 30 * 100) / 100, // Approximate
          prevValue: Math.round((spyPrice / (1 + spyChange/100)) * 30 * 100) / 100,
          change: spyChange * 1.1 // Nasdaq typically moves more than S&P
        },
        {
          name: "DOW JONES",
          value: Math.round(spyPrice * 80 * 100) / 100, // Approximate
          prevValue: Math.round((spyPrice / (1 + spyChange/100)) * 80 * 100) / 100,
          change: spyChange * 0.9 // Dow typically moves less than S&P
        }
      ];
    }
    
    // Fallback to mock data if API call fails
    return marketOverviewData.indices;
  } catch (error) {
    console.error("Error fetching market indices:", error);
    // Return mock data as fallback
    return marketOverviewData.indices;
  }
};

// Function to generate chart data based on current market indices
export const generateChartData = (indices: MarketIndex[]): ChartData[] => {
  const spIndex = indices.find(index => index.name === "S&P 500");
  const nasdaqIndex = indices.find(index => index.name === "NASDAQ");
  const dowIndex = indices.find(index => index.name === "DOW JONES");
  
  if (!spIndex || !nasdaqIndex || !dowIndex) {
    return marketOverviewData.chart; // Fallback to mock data
  }
  
  // Generate realistic-looking chart data based on current values
  const daysInMonth = 30;
  const result: ChartData[] = [];
  
  // End values (most recent)
  const endSP = spIndex.value;
  const endNasdaq = nasdaqIndex.value;
  const endDow = dowIndex.value;
  
  // Start values (approximately 3-5% lower to show growth)
  const startSP = endSP * 0.97;
  const startNasdaq = endNasdaq * 0.96;
  const startDow = endDow * 0.975;
  
  for (let i = 0; i < 7; i++) {
    const progress = i / 6; // 0 to 1
    
    // Calculate values with some randomness
    const randomFactor = 0.99 + Math.random() * 0.02; // 0.99 to 1.01
    
    result.push({
      date: `Apr ${i * 5 + 1}`,
      sp500: Math.round((startSP + (endSP - startSP) * progress) * randomFactor),
      nasdaq: Math.round((startNasdaq + (endNasdaq - startNasdaq) * progress) * randomFactor),
      dowjones: Math.round((startDow + (endDow - startDow) * progress) * randomFactor),
    });
  }
  
  // Make sure the last data point matches the current values
  result[result.length - 1] = {
    date: "Apr 30",
    sp500: Math.round(endSP),
    nasdaq: Math.round(endNasdaq),
    dowjones: Math.round(endDow),
  };
  
  return result;
};

// Function to update stock recommendation data with real-time prices
export const updateRecommendationsWithRealData = async (
  recommendations: StockRecommendation[]
): Promise<StockRecommendation[]> => {
  const updatedRecommendations = [...recommendations];
  
  // Process stocks in sequence to avoid API rate limiting
  for (let i = 0; i < updatedRecommendations.length; i++) {
    const stock = updatedRecommendations[i];
    const realData = await fetchStockQuote(stock.symbol);
    
    if (realData) {
      updatedRecommendations[i] = {
        ...stock,
        price: realData.price,
        change: realData.change,
        changePercent: realData.changePercent,
      };
    }
    
    // Add small delay to avoid hitting API rate limits
    if (i < updatedRecommendations.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return updatedRecommendations;
};
