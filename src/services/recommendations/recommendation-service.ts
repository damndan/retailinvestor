// Services for stock recommendations

import { StockRecommendation } from '../types/market-types';
import { fetchStockPrice } from '../api/stock-api';

// Default stock symbols for recommendations
const DEFAULT_BUY_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
const DEFAULT_SELL_SYMBOLS = ['META', 'NFLX', 'TSLA', 'INTC', 'IBM'];

// Generate realistic recommendations
const generateRecommendations = (symbols: string[], type: 'buy' | 'sell'): StockRecommendation[] => {
  const today = new Date();
  const recommendations: StockRecommendation[] = [];
  
  symbols.forEach((symbol, index) => {
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    // Create a recommendation
    recommendations.push({
      symbol,
      name: getCompanyName(symbol),
      price: 0, // Will be filled by fetchStockPrice
      change: 0, // Will be filled by fetchStockPrice
      changePercent: 0, // Will be filled by fetchStockPrice
      recommendation: type,
      targetPrice: 0, // Will be calculated after price is fetched
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
    });
  });
  
  return recommendations;
};

// Helper function to get company name from symbol
const getCompanyName = (symbol: string): string => {
  const companies: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms, Inc.',
    'NFLX': 'Netflix, Inc.',
    'TSLA': 'Tesla, Inc.',
    'INTC': 'Intel Corporation',
    'IBM': 'International Business Machines',
  };
  
  return companies[symbol] || `${symbol} Corp`;
};

// Update recommendations with real data
export const updateRecommendationsWithRealData = async (recommendations: StockRecommendation[]): Promise<StockRecommendation[]> => {
  try {
    // Update recommendations with live data
    const updatedRecs = await Promise.all(
      recommendations.map(async (stock) => {
        try {
          const liveData = await fetchStockPrice(stock.symbol);
          
          // Calculate a realistic target price based on the recommendation type
          const targetPriceFactor = stock.recommendation === 'buy' ? 1.15 : 0.85; // 15% up for buy, 15% down for sell
          const targetPrice = liveData.price * targetPriceFactor;
          
          return { 
            ...stock, 
            ...liveData,
            targetPrice
          };
        } catch (error) {
          console.warn(`Error fetching data for ${stock.symbol}`, error);
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
    // Generate base recommendations
    const buyRecs = generateRecommendations(DEFAULT_BUY_SYMBOLS, 'buy');
    const sellRecs = generateRecommendations(DEFAULT_SELL_SYMBOLS, 'sell');
    
    // Update buy recommendations with live data
    const updatedBuyRecs = await updateRecommendationsWithRealData(buyRecs);
    
    // Update sell recommendations with live data
    const updatedSellRecs = await updateRecommendationsWithRealData(sellRecs);
    
    return {
      buy: updatedBuyRecs,
      sell: updatedSellRecs
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Return empty arrays instead of mock data
    return {
      buy: [],
      sell: []
    };
  }
};
