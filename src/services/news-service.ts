
import { markDataRefreshed, shouldRefreshData } from "./financial-service";

// Store the last news refresh timestamp
const NEWS_REFRESH_KEY = 'last_news_data_refresh';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: 'markets' | 'stocks' | 'investing' | 'economy';
  tickers?: string[];
}

// Mock news data for retail investors
const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Fed Chair Powell Signals Patience on Rate Cuts',
    summary: 'Federal Reserve Chairman Jerome Powell indicated the central bank will take a patient approach to cutting interest rates, citing continued strong economic data.',
    source: 'Financial Times',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'economy',
    tickers: ['SPY', 'QQQ', 'DIA']
  },
  {
    id: '2',
    title: 'Retail Giants Report Mixed Earnings',
    summary: 'Major retailers showed mixed results this quarter, with some exceeding expectations while others struggled with inventory management and changing consumer spending habits.',
    source: 'Wall Street Journal',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'stocks',
    tickers: ['WMT', 'TGT', 'COST']
  },
  {
    id: '3',
    title: 'Tech Stocks Continue Rally on AI Optimism',
    summary: 'Technology shares extended their rally as investors remain optimistic about artificial intelligence applications and their potential to drive future earnings.',
    source: 'Bloomberg',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    publishedAt: new Date().toISOString(),
    category: 'stocks',
    tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL']
  },
  {
    id: '4',
    title: 'Oil Prices Decline on Supply Concerns',
    summary: 'Crude oil prices dropped as OPEC+ members discuss potential increases in production quotas, while global demand forecasts remain uncertain.',
    source: 'Reuters',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'markets',
    tickers: ['XOM', 'CVX', 'USO']
  },
  {
    id: '5',
    title: 'ETF Inflows Hit Record High',
    summary: 'Exchange-traded funds saw record inflows last month as retail investors continue to favor passive investment vehicles for market exposure.',
    source: 'Investor\'s Business Daily',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'investing',
    tickers: ['SPY', 'VOO', 'VTI']
  }
];

// Check if we need to refresh news data (once per day)
export const shouldRefreshNewsData = (): boolean => {
  try {
    const lastRefresh = localStorage.getItem(NEWS_REFRESH_KEY);
    
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
    console.error('Error checking news refresh status:', error);
    // If there's an error, refresh to be safe
    return true;
  }
};

// Mark news data as refreshed
export const markNewsDataRefreshed = (): void => {
  try {
    localStorage.setItem(NEWS_REFRESH_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error marking news data as refreshed:', error);
  }
};

// Generate fresh news data with today's date
export const generateFreshNewsData = (): NewsArticle[] => {
  const today = new Date();
  
  // Generate random variations for each article's publication time
  return mockNewsArticles.map(article => {
    const publishTime = new Date(today);
    publishTime.setHours(Math.floor(Math.random() * 12) + 6); // Random hour between 6am and 6pm
    publishTime.setMinutes(Math.floor(Math.random() * 60));
    
    return {
      ...article,
      publishedAt: publishTime.toISOString()
    };
  });
};

// Fetch news articles for retail investors
export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    // Check if we need fresh news
    if (shouldRefreshNewsData() || shouldRefreshData()) {
      console.log("Generating fresh news data...");
      const freshNews = generateFreshNewsData();
      markNewsDataRefreshed();
      
      // In a real implementation, we would fetch from a news API
      // For now, return the mock news with today's date
      return freshNews;
    }
    
    // If we don't need to refresh, return the existing mock data
    return mockNewsArticles;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return mockNewsArticles;
  }
};

// Filter news by tickers or category
export const filterNewsByTickers = (news: NewsArticle[], tickers: string[]): NewsArticle[] => {
  if (!tickers.length) return news;
  
  return news.filter(article => 
    article.tickers?.some(ticker => tickers.includes(ticker))
  );
};

export const filterNewsByCategory = (news: NewsArticle[], category: string): NewsArticle[] => {
  if (!category) return news;
  
  return news.filter(article => article.category === category);
};
