import { MarketIndex } from "../types/market-types";
import { fetchStockPrice } from "./stock-api";
import { shouldRefreshData, markDataRefreshed } from "../utils/data-refresh";

// Cache for market indices
let cachedIndices: MarketIndex[] | null = null;
let lastFetchTime: Date | null = null;

// Fetch market indices data
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    console.log("Fetching market indices...");
    
    // Check if we have cached indices and if they're still valid
    const shouldRefresh = !cachedIndices || 
                          !lastFetchTime || 
                          shouldRefreshData() || 
                          (new Date().getTime() - lastFetchTime.getTime() > 5 * 60 * 1000); // Refresh every 5 minutes
    
    if (shouldRefresh) {
      console.log("Fetching fresh market indices...");
      
      // Define the indices we want to fetch
      const indices = [
        { symbol: "^GSPC", name: "S&P 500" },
        { symbol: "^IXIC", name: "NASDAQ" },
        { symbol: "^DJI", name: "Dow Jones" }
      ];
      
      // Fetch data for each index
      const results = await Promise.all(
        indices.map(async (index) => {
          try {
            const data = await fetchStockPrice(index.symbol);
            
            // Create the market index object
            return {
              name: index.name,
              value: data.price,
              prevValue: data.price - data.change,
              change: data.change
            };
          } catch (error) {
            console.error(`Error fetching data for index ${index.symbol}:`, error);
            throw error;
          }
        })
      );
      
      console.log("Fresh market indices fetched successfully:", results);
      
      // Update cache
      cachedIndices = results;
      lastFetchTime = new Date();
      markDataRefreshed();
      
      return results;
    } else {
      console.log(`Using cached market indices from ${lastFetchTime?.toLocaleTimeString()}`);
      return cachedIndices || [];
    }
  } catch (error) {
    console.error("Error fetching market indices:", error);
    return cachedIndices || [];
  }
};

// Force refresh market indices (can be called from UI)
export const refreshMarketIndices = async (): Promise<MarketIndex[]> => {
  console.log("Forcing refresh of market indices...");
  cachedIndices = null;
  lastFetchTime = null;
  return fetchMarketIndices();
}; 