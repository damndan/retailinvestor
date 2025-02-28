
// Services for market data

import { MarketIndex, ChartData } from '../types/market-types';
import { fetchStockPrice } from '../api/stock-api';
import { marketOverviewData } from '@/data/mock-data';

// Fetch market indices data using our stock API
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
