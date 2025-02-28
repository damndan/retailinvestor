
import { buyRecommendations, sellRecommendations, marketOverviewData } from "@/data/mock-data";

// Types
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

export interface StockRecommendation {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  analysis: string;
  date?: string; // Date when this recommendation was made
}

// API key for Alpha Vantage (free tier)
const API_KEY = 'FRGQGC2VTSM5QNL1';

// Store the last data refresh timestamp in localStorage
const DATA_REFRESH_KEY = 'last_market_data_refresh';

// Check if we need to refresh market data (once per day)
export const shouldRefreshData = (): boolean => {
  try {
    const lastRefresh = localStorage.getItem(DATA_REFRESH_KEY);
    
    if (!lastRefresh) {
      // No refresh recorded yet, we should refresh
      return true;
    }
    
    const lastRefreshDate = new Date(lastRefresh);
    const currentDate = new Date();
    
    // Check if the last refresh was on a different date
    return (
      lastRefreshDate.getDate() !== currentDate.getDate() ||
      lastRefreshDate.getMonth() !== currentDate.getMonth() ||
      lastRefreshDate.getFullYear() !== currentDate.getFullYear()
    );
  } catch (error) {
    console.error('Error checking data refresh status:', error);
    // If there's an error, refresh to be safe
    return true;
  }
};

// Mark data as refreshed
export const markDataRefreshed = (): void => {
  try {
    localStorage.setItem(DATA_REFRESH_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error marking data as refreshed:', error);
  }
};

// Fetch current stock price from Alpha Vantage API
export const fetchStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    const data = await response.json();
    
    // Check if we hit the API limit or got an error
    if (data.Note || data.Information || !data['Global Quote']) {
      console.warn('API limit reached or error:', data);
      throw new Error('API limit reached');
    }
    
    const quote = data['Global Quote'];
    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
    
    return { price, change, changePercent };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

// Update recommendations with real data
export const updateRecommendationsWithRealData = async (recommendations: StockRecommendation[]): Promise<StockRecommendation[]> => {
  try {
    // Update recommendations with live data
    const updatedRecs = await Promise.all(
      recommendations.map(async (stock) => {
        try {
          const liveData = await fetchStockPrice(stock.symbol);
          return { ...stock, ...liveData };
        } catch (error) {
          console.warn(`Falling back to mock data for ${stock.symbol}`);
          return stock;
        }
      })
    );
    
    return updatedRecs;
  } catch (error) {
    console.error('Error updating recommendations:', error);
    // Fallback to original data
    return recommendations;
  }
};

// Filter recommendations by date
export const filterRecommendationsByDate = (recommendations: StockRecommendation[], selectedDate: Date | null): StockRecommendation[] => {
  if (!selectedDate) {
    return recommendations;
  }
  
  const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  // If recommendation has a date field, filter by it
  return recommendations.filter(rec => {
    if (!rec.date) return true; // Include recommendations without dates
    return rec.date === dateString;
  });
};

// Fetch recommendations with live stock data
export const fetchRecommendations = async (): Promise<{
  buy: StockRecommendation[];
  sell: StockRecommendation[];
}> => {
  try {
    // Update buy recommendations with live data
    const updatedBuyRecs = await updateRecommendationsWithRealData(buyRecommendations);
    
    // Update sell recommendations with live data
    const updatedSellRecs = await updateRecommendationsWithRealData(sellRecommendations);
    
    return {
      buy: updatedBuyRecs,
      sell: updatedSellRecs
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fallback to mock data
    return {
      buy: buyRecommendations,
      sell: sellRecommendations
    };
  }
};

// Fetch market indices data
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    // Use SPY as a proxy for S&P 500
    const spyData = await fetchStockPrice('SPY');
    const nasdaqData = await fetchStockPrice('QQQ'); // QQQ tracks NASDAQ-100
    const dowData = await fetchStockPrice('DIA');   // DIA tracks Dow Jones
    
    // Adjust the ETF prices to be more representative of the actual indices
    const indices: MarketIndex[] = [
      {
        name: 'S&P 500',
        value: spyData.price * 10, // Approximate conversion
        prevValue: spyData.price * 10 - spyData.change * 10,
        change: spyData.changePercent
      },
      {
        name: 'NASDAQ',
        value: nasdaqData.price * 70, // Approximate conversion
        prevValue: nasdaqData.price * 70 - nasdaqData.change * 70,
        change: nasdaqData.changePercent
      },
      {
        name: 'DOW JONES',
        value: dowData.price * 100, // Approximate conversion
        prevValue: dowData.price * 100 - dowData.change * 100,
        change: dowData.changePercent
      }
    ];
    
    return indices;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    // Fallback to mock data
    return marketOverviewData.indices;
  }
};

// Generate historical chart data based on current indices
export const generateChartData = (indices: MarketIndex[]): ChartData[] => {
  // For real implementation, we would fetch historical data
  // For now, return the mock chart data which now spans years
  return marketOverviewData.chart;
};
