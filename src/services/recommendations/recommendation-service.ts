
// Services for stock recommendations

import { StockRecommendation } from '../types/market-types';
import { fetchStockPrice } from '../api/stock-api';
import { buyRecommendations, sellRecommendations } from '@/data/mock-data';

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
