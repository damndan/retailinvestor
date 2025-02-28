
// Utilities for handling data refresh

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
