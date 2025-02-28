
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

// Fetch current stock price from Yahoo Finance API
export const fetchStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    // Using a public API that doesn't require API keys to fetch Yahoo Finance data
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

// Fetch market indices data using Yahoo Finance symbols
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    // Fetch data for the actual indices
    const spyData = await fetchStockPrice('^GSPC');  // S&P 500
    const nasdaqData = await fetchStockPrice('^IXIC'); // NASDAQ Composite
    const dowData = await fetchStockPrice('^DJI');   // Dow Jones Industrial Average
    
    const indices: MarketIndex[] = [
      {
        name: 'S&P 500',
        value: spyData.price,
        prevValue: spyData.price - spyData.change,
        change: spyData.changePercent
      },
      {
        name: 'NASDAQ',
        value: nasdaqData.price,
        prevValue: nasdaqData.price - nasdaqData.change,
        change: nasdaqData.changePercent
      },
      {
        name: 'DOW JONES',
        value: dowData.price,
        prevValue: dowData.price - dowData.change,
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
