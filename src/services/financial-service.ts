
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
}

// API key for Alpha Vantage (free tier)
const API_KEY = 'FRGQGC2VTSM5QNL1';

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

// Fetch recommendations with live stock data
export const fetchRecommendations = async (): Promise<{
  buy: StockRecommendation[];
  sell: StockRecommendation[];
}> => {
  try {
    // Update buy recommendations with live data
    const updatedBuyRecs = await Promise.all(
      buyRecommendations.map(async (stock) => {
        try {
          const liveData = await fetchStockPrice(stock.symbol);
          return { ...stock, ...liveData };
        } catch (error) {
          console.warn(`Falling back to mock data for ${stock.symbol}`);
          return stock;
        }
      })
    );
    
    // Update sell recommendations with live data
    const updatedSellRecs = await Promise.all(
      sellRecommendations.map(async (stock) => {
        try {
          const liveData = await fetchStockPrice(stock.symbol);
          return { ...stock, ...liveData };
        } catch (error) {
          console.warn(`Falling back to mock data for ${stock.symbol}`);
          return stock;
        }
      })
    );
    
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
