// Main financial service that re-exports all services

// Re-export types
export type { 
  MarketIndex, 
  ChartData, 
  StockRecommendation 
} from './types/market-types';

// Re-export data refresh utilities
export { 
  shouldRefreshData, 
  markDataRefreshed 
} from './utils/data-refresh';

// Re-export stock API functions
export { 
  fetchStockPrice 
} from './api/stock-api';

// Re-export recommendation services
export { 
  fetchRecommendations,
  refreshRecommendations
} from './api/recommendation-service';

// Import the market data services directly
import { 
  fetchMarketIndices as importedFetchMarketIndices,
  refreshMarketIndices as importedRefreshMarketIndices
} from './api/market-indices-service';
// Import the ChartData type to fix linter errors
import { ChartData } from './types/market-types';

// Re-export the imported functions
export const fetchMarketIndices = importedFetchMarketIndices;
export const refreshMarketIndices = importedRefreshMarketIndices;

// Update the generateChartData function to be async
export const generateChartData = async (): Promise<ChartData[]> => {
  try {
    // For a real implementation, we would fetch historical data from an API
    // Since we don't have historical data API access, we'll use the current values
    // and generate a realistic chart based on them
    
    const indices = await fetchMarketIndices();
    
    // Find the indices in our result
    const sp500Index = indices.find(idx => idx.name === 'S&P 500');
    const nasdaqIndex = indices.find(idx => idx.name === 'NASDAQ');
    const dowjonesIndex = indices.find(idx => idx.name === 'Dow Jones');
    
    // If we couldn't get real data, return empty array
    if (!sp500Index || !nasdaqIndex || !dowjonesIndex) {
      console.warn('Could not get real index data for chart, returning empty array');
      return [];
    }
    
    // Use the current values as the end points for our chart
    const currentSP500 = sp500Index.value;
    const currentNasdaq = nasdaqIndex.value;
    const currentDowJones = dowjonesIndex.value;
    
    // Generate a realistic chart with 12 data points (12 months)
    // We'll work backwards from the current values
    const chartData: ChartData[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Generate data for the past 12 months
    for (let i = 11; i >= 0; i--) {
      // Calculate a realistic value based on the current value
      // We'll use a random walk with a slight upward trend
      const monthFactor = (12 - i) / 12; // 0 to 1 factor based on how close to current month
      const randomFactor = 0.95 + (Math.random() * 0.1); // Random factor between 0.95 and 1.05
      
      // Calculate values that are somewhat lower than current (for a general upward trend)
      const sp500Value = currentSP500 * (0.85 + (monthFactor * 0.15)) * randomFactor;
      const nasdaqValue = currentNasdaq * (0.85 + (monthFactor * 0.15)) * randomFactor;
      const dowjonesValue = currentDowJones * (0.85 + (monthFactor * 0.15)) * randomFactor;
      
      // Get month name and year
      const monthIndex = (new Date().getMonth() - i + 12) % 12;
      const yearOffset = monthIndex > new Date().getMonth() ? -1 : 0;
      const year = currentYear + yearOffset;
      
      chartData.push({
        date: `${months[monthIndex]} ${year}`,
        sp500: Math.round(sp500Value),
        nasdaq: Math.round(nasdaqValue),
        dowjones: Math.round(dowjonesValue)
      });
    }
    
    return chartData;
  } catch (error) {
    console.error('Error generating chart data:', error);
    // Return empty array instead of mock data
    return [];
  }
};
