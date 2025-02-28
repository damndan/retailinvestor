
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockCard } from "@/components/stock-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

// Mock data
import { buyRecommendations, sellRecommendations } from "@/data/mock-data";
import { fetchRecommendations } from "@/services/financial-service";

interface DashboardProps {
  className?: string;
}

// Define a generic StockRecommendation type that can handle all recommendation types
interface StockRecommendation {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: "buy" | "sell" | "hold";
  confidence: number;
  analysis: string;
  date?: Date;
}

export function Dashboard({ className }: DashboardProps) {
  const [buyStocks, setBuyStocks] = useState<StockRecommendation[]>(buyRecommendations);
  const [sellStocks, setSellStocks] = useState<StockRecommendation[]>(sellRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Filtered stocks based on the selected date
  const [filteredBuyStocks, setFilteredBuyStocks] = useState<StockRecommendation[]>(buyRecommendations);
  const [filteredSellStocks, setFilteredSellStocks] = useState<StockRecommendation[]>(sellRecommendations);

  // Add historical dates to stock recommendations for demo purposes
  const addHistoricalDates = (stocks: StockRecommendation[]): StockRecommendation[] => {
    // Create a copy of the stocks array with simulated dates
    return stocks.map((stock, index) => {
      // Assign some stocks to past dates for demo purposes
      let stockDate = new Date();
      
      // Distribute stocks across different dates in the past 30 days
      const daysAgo = index % 5; // Use modulo to create repeating pattern
      stockDate.setDate(stockDate.getDate() - daysAgo);
      
      return { ...stock, date: stockDate };
    });
  };

  // Filter stocks based on selected date
  const filterStocksByDate = (stocks: StockRecommendation[], selectedDate: Date | undefined) => {
    if (!selectedDate) return stocks;
    
    return stocks.filter(stock => {
      if (!stock.date) return true; // Include stocks with no date
      
      const stockDate = new Date(stock.date);
      return stockDate.toDateString() === selectedDate.toDateString();
    });
  };

  useEffect(() => {
    const fetchRealStockData = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch real recommendations
        const recommendations = await fetchRecommendations();
        
        // Add simulated historical dates to the stock data
        const datedBuyStocks = addHistoricalDates(recommendations.buy);
        const datedSellStocks = addHistoricalDates(recommendations.sell);
        
        setBuyStocks(datedBuyStocks);
        setSellStocks(datedSellStocks);
        
        // Initially filter stocks for today's date
        setFilteredBuyStocks(filterStocksByDate(datedBuyStocks, date));
        setFilteredSellStocks(filterStocksByDate(datedSellStocks, date));
      } catch (error) {
        console.error("Failed to fetch real stock data:", error);
        
        // Fallback to mock data with dates
        const datedBuyStocks = addHistoricalDates(buyRecommendations);
        const datedSellStocks = addHistoricalDates(sellRecommendations);
        
        setBuyStocks(datedBuyStocks);
        setSellStocks(datedSellStocks);
        
        // Initially filter stocks for today's date
        setFilteredBuyStocks(filterStocksByDate(datedBuyStocks, date));
        setFilteredSellStocks(filterStocksByDate(datedSellStocks, date));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealStockData();
  }, []);

  // Update filtered stocks when date changes
  useEffect(() => {
    setFilteredBuyStocks(filterStocksByDate(buyStocks, date));
    setFilteredSellStocks(filterStocksByDate(sellStocks, date));
  }, [date, buyStocks, sellStocks]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  return (
    <div className={cn("grid lg:grid-cols-12 gap-6 p-6", className)}>
      <div className="lg:col-span-8 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Recommendations</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="buy" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {isLoading && (
                <span className="text-xs text-muted-foreground mr-3">
                  Fetching real-time data...
                </span>
              )}
              <TabsList>
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="buy" className="mt-0">
            {filteredBuyStocks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredBuyStocks.map((stock, index) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    className={cn(
                      "animate-fade-in",
                      index === 0 ? "" : "animation-delay-200",
                      index === 1 ? "animation-delay-200" : "",
                      index === 2 ? "animation-delay-400" : "",
                      index === 3 ? "animation-delay-600" : ""
                    )} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No buy recommendations for {date ? format(date, "PPP") : "the selected date"}.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sell" className="mt-0">
            {filteredSellStocks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredSellStocks.map((stock, index) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    className={cn(
                      "animate-fade-in",
                      index === 0 ? "" : "animation-delay-200",
                      index === 1 ? "animation-delay-200" : "",
                      index === 2 ? "animation-delay-400" : "",
                      index === 3 ? "animation-delay-600" : ""
                    )} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No sell recommendations for {date ? format(date, "PPP") : "the selected date"}.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-4 space-y-6 animate-fade-in animation-delay-200">
        <Summary />
        <MarketOverview selectedDate={date} />
      </div>
    </div>
  );
}
