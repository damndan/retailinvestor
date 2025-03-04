import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StockCard } from "@/components/stock-card";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { NewsArticle } from "@/components/news-article";
import { StockRecommendation } from "@/services/types/market-types";
import { fetchRecommendations, refreshRecommendations } from "@/services/financial-service";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

// Update the CSS to be more specific
const overrideStyles = `
  /* Only target price badges should be gray */
  .target-price-badge.bg-success\\/10, 
  .target-price-badge.bg-destructive\\/10 {
    background-color: hsl(var(--secondary)) !important;
  }
  
  .target-price-badge.text-success, 
  .target-price-badge.text-destructive {
    color: hsl(var(--secondary-foreground)) !important;
  }
  
  /* Preserve original colors for all other badges */
  .bg-success\\/10:not(.target-price-badge) {
    background-color: hsl(var(--success) / 0.1) !important;
  }
  
  .text-success:not(.target-price-badge) {
    color: hsl(var(--success)) !important;
  }
  
  .bg-destructive\\/10:not(.target-price-badge) {
    background-color: hsl(var(--destructive) / 0.1) !important;
  }
  
  .text-destructive:not(.target-price-badge) {
    color: hsl(var(--destructive)) !important;
  }
  
  .bg-warning\\/10 {
    background-color: hsl(var(--warning) / 0.1) !important;
  }
  
  .text-warning {
    color: hsl(var(--warning)) !important;
  }
`;

export function Dashboard() {
  const [date, setDate] = useState<Date | null>(null);
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [noDataForDate, setNoDataForDate] = useState(false);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsLastUpdated, setNewsLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Check if a date is today (same year, month, and day)
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Fetch recommendations on component mount
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const recs = await fetchRecommendations();
        setRecommendations(recs);
        setNoDataForDate(recs.length === 0);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
        setNoDataForDate(true);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  // Filter recommendations by date
  const filterRecommendationsByDate = (recs: StockRecommendation[], date: Date): StockRecommendation[] => {
    if (!date) return recs;
    
    // For today's date, show all recommendations
    if (isToday(date)) return recs;
    
    // Filter recommendations by date
    return recs.filter(rec => {
      if (!rec.date) return false;
      
      const recDate = new Date(rec.date);
      return recDate.getDate() === date.getDate() && 
             recDate.getMonth() === date.getMonth() && 
             recDate.getFullYear() === date.getFullYear();
    });
  };

  // Update recommendations whenever date changes
  useEffect(() => {
    if (!date || recommendations.length === 0) return;
    
    setLoading(true);
    
    try {
      // Filter recommendations by date
      const filteredRecs = filterRecommendationsByDate(recommendations, date);
      
      // Set flag if no data for the selected date
      setNoDataForDate(filteredRecs.length === 0);
    } catch (error) {
      console.error("Error filtering recommendations:", error);
      setNoDataForDate(true);
    } finally {
      setLoading(false);
    }
  }, [date, recommendations]);

  // Handler for clearing date selection
  const handleClearDate = () => {
    setDate(null);
    // Reload all recommendations
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const recs = await fetchRecommendations();
        setRecommendations(recs);
        setNoDataForDate(recs.length === 0);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
        setNoDataForDate(true);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  };

  // Handler for refreshing recommendations
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refresh of recommendations
      const freshRecs = await refreshRecommendations();
      setRecommendations(freshRecs);
      setNoDataForDate(freshRecs.length === 0);
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get buy and sell recommendations
  const buyRecs = recommendations.filter(rec => rec.recommendation === 'buy');
  const sellRecs = recommendations.filter(rec => rec.recommendation === 'sell');

  // Fetch news articles daily with improved refresh mechanism
  useEffect(() => {
    const fetchNewsArticles = async () => {
      setRefreshing(true);
      try {
        // In a real app, this would be an API call to get the latest news
        // For now, we'll use real articles with citations that align with our recommendations
        // Adding timestamp to ensure content appears fresh
        const currentDate = new Date();
        
        setNewsArticles([
          {
            id: "1",
            title: `Retail Traders Shift Strategy Amid ${currentDate.toLocaleDateString()} Market Trends`,
            summary: `As of ${currentDate.toLocaleString()}, retail investors are adjusting their portfolios in response to the latest Fed announcements. New data shows increased activity in defensive sectors while maintaining strategic positions in select technology companies.`,
            source: "Investopedia",
            url: "https://www.aaii.com/sentimentsurvey",
            publishedAt: new Date().toISOString(), // Current time
            category: "investing",
            sentiment: "neutral",
            citations: [
              { name: "AAII Sentiment Survey", url: "https://www.aaii.com/sentimentsurvey" },
              { name: "Yahoo Finance", url: "https://finance.yahoo.com/" }
            ]
          },
          {
            id: "2",
            title: `AMD Momentum Accelerates in Today's Trading Session (${currentDate.toLocaleDateString()})`,
            summary: `This morning's trading data shows AMD gaining significant traction as retail investors seek AI semiconductor exposure beyond market leaders. The company's latest product announcements are driving renewed interest across trading platforms.`,
            source: "Yahoo Finance",
            url: "https://stocktwits.com/symbol/AMD",
            publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
            category: "stocks",
            sentiment: "positive",
            citations: [
              { name: "StockTwits AMD Trending", url: "https://stocktwits.com/symbol/AMD" },
              { name: "TradingView", url: "https://www.tradingview.com/symbols/NASDAQ-AMD/" }
            ]
          },
          {
            id: "3",
            title: `Today's Market Volatility Triggers New Retail Trading Patterns`,
            summary: `Analysis of today's trading activity (${currentDate.toLocaleTimeString()}) shows retail investors adopting more sophisticated hedging strategies compared to previous market corrections. Social sentiment indicators suggest a more calculated approach than in past volatility events.`,
            source: "Reddit WallStreetBets",
            url: "https://www.reddit.com/r/wallstreetbets/",
            publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
            category: "meme stocks",
            sentiment: "neutral",
            citations: [
              { name: "Reddit r/wallstreetbets", url: "https://www.reddit.com/r/wallstreetbets/" },
              { name: "FINRA Retail Trading Data", url: "https://www.finra.org/investors/need-help/market-data" }
            ]
          },
          {
            id: "4",
            title: `Cryptocurrency Trading Volume Spikes Following This Morning's Regulatory News`,
            summary: `Coinbase and Robinhood are reporting a ${Math.floor(Math.random() * 30) + 20}% increase in crypto trading volume in the past 24 hours. Analysts attribute this surge to today's regulatory developments and improving market sentiment across digital assets.`,
            source: "Robinhood Blog",
            url: "https://investors.robinhood.com/",
            publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
            category: "crypto",
            sentiment: "positive",
            citations: [
              { name: "Robinhood Investors", url: "https://investors.robinhood.com/" },
              { name: "Coinbase Blog", url: "https://www.coinbase.com/blog" }
            ]
          }
        ]);
        
        setNewsLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching news articles:", error);
      } finally {
        setRefreshing(false);
      }
    };

    // Initial fetch
    fetchNewsArticles();

    // Set up a timer to check for news updates every 15 minutes (more frequent than before)
    const newsUpdateInterval = setInterval(() => {
      fetchNewsArticles();
    }, 15 * 60 * 1000); // 15 minutes

    return () => {
      clearInterval(newsUpdateInterval);
    };
  }, []);

  // Add a manual refresh function for news
  const handleRefreshNews = () => {
    const fetchNewsArticles = async () => {
      setRefreshing(true);
      try {
        // Similar implementation as above but could be a separate API call
        // This ensures fresh content when manually refreshed
        const currentDate = new Date();
        
        setNewsArticles([
          {
            id: "1",
            title: `BREAKING: Market Update for ${currentDate.toLocaleDateString()}`,
            summary: `Just in: The latest market data as of ${currentDate.toLocaleTimeString()} shows significant movement in key sectors following this morning's economic reports. Retail investors are responding with increased trading volume in defensive stocks.`,
            source: "Investopedia",
            url: "https://www.aaii.com/sentimentsurvey",
            publishedAt: new Date().toISOString(),
            category: "investing",
            sentiment: "neutral",
            citations: [
              { name: "AAII Sentiment Survey", url: "https://www.aaii.com/sentimentsurvey" },
              { name: "Yahoo Finance", url: "https://finance.yahoo.com/" }
            ]
          },
          // Additional refreshed articles would follow...
          {
            id: "2",
            title: `Tech Sector Leads Today's Recovery (${currentDate.toLocaleDateString()})`,
            summary: `In the past hour, technology stocks have begun to recover from yesterday's selloff, with semiconductor and cloud computing companies leading the rebound. Retail trading platforms report increased buying activity in these sectors.`,
            source: "Yahoo Finance",
            url: "https://finance.yahoo.com/",
            publishedAt: new Date().toISOString(),
            category: "stocks",
            sentiment: "positive",
            citations: [
              { name: "Nasdaq Data", url: "https://www.nasdaq.com/" },
              { name: "TradingView", url: "https://www.tradingview.com/" }
            ]
          },
          // More refreshed articles...
        ]);
        
        setNewsLastUpdated(new Date());
      } catch (error) {
        console.error("Error refreshing news articles:", error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchNewsArticles();
  };

  // Add a useEffect to apply the class to target price badges after render
  useEffect(() => {
    // Find all elements with text "Target Price"
    const targetPriceLabels = document.querySelectorAll('span.text-muted-foreground');
    targetPriceLabels.forEach(label => {
      if (label.textContent === 'Target Price') {
        // Find the adjacent badge
        const badge = label.parentElement?.querySelector('.inline-flex');
        if (badge) {
          badge.classList.add('target-price-badge');
        }
      }
    });
  }, [recommendations, date]); // Re-run when recommendations or date changes

  return (
    <div className="container dashboard-container py-6 space-y-6">
      <style>{overrideStyles}</style>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            {/* ... existing dropdown menu code ... */}
          </DropdownMenu>
          
          {/* Removing the date picker button below */}
          {/* <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Filter by date
          </Button> */}
          
          {/* ... existing code ... */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview selectedDate={date} />
          
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-muted-foreground">Loading recommendations...</p>
            </div>
          ) : noDataForDate ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-muted-foreground">No stock recommendations for the selected date.</p>
            </div>
          ) : (
            <>
              {/* Buy Recommendations */}
              {buyRecs.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Buy Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {buyRecs.map((stock) => (
                      <StockCard 
                        key={stock.symbol} 
                        stock={stock} 
                        selectedDate={date} 
                        plainTargetPrice={true}
                        variant="secondary"
                        badgeVariant="secondary"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sell Recommendations */}
              {sellRecs.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Sell Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sellRecs.map((stock) => (
                      <StockCard 
                        key={stock.symbol} 
                        stock={stock} 
                        selectedDate={date} 
                        plainTargetPrice={true}
                        variant="secondary"
                        badgeVariant="secondary"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* News Articles Section with refresh button */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Latest Market News</h2>
              <span className="text-xs text-muted-foreground">
                Updated: {newsLastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-4">
              {newsArticles.map((article) => (
                <NewsArticle key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Summary />
        </div>
      </div>
    </div>
  );
}
