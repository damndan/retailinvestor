
// Main financial service that re-exports all services

// Re-export types
export { 
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
  updateRecommendationsWithRealData, 
  filterRecommendationsByDate, 
  fetchRecommendations 
} from './recommendations/recommendation-service';

// Re-export market data services
export { 
  fetchMarketIndices, 
  generateChartData 
} from './market/market-data-service';
