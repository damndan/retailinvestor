
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockCard } from "@/components/stock-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Mock data
import { buyRecommendations, sellRecommendations } from "@/data/mock-data";
import { 
  fetchRecommendations, 
  updateRecommendationsWithRealData,
  filterRecommendationsByDate,
  StockRecommendation 
} from "@/services/financial-service";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [buyStocks, setBuyStocks] = useState<StockRecommendation[]>(buyRecommendations);
  const [sellStocks, setSellStocks] = useState<StockRecommendation[]>(sellRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    const fetchRealStockData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recommendations
        const { buy, sell } = await fetchRecommendations();
        
        // Apply date filtering if a date is selected
        const filteredBuyStocks = filterRecommendationsByDate(buy, selectedDate);
        const filteredSellStocks = filterRecommendationsByDate(sell, selectedDate);
        
        setBuyStocks(filteredBuyStocks);
        setSellStocks(filteredSellStocks);
      } catch (error) {
        console.error("Failed to fetch real stock data:", error);
        
        // Fallback to mock data with date filtering
        const filteredBuyStocks = filterRecommendationsByDate(buyRecommendations, selectedDate);
        const filteredSellStocks = filterRecommendationsByDate(sellRecommendations, selectedDate);
        
        setBuyStocks(filteredBuyStocks);
        setSellStocks(filteredSellStocks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealStockData();
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
    setDatePopoverOpen(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    setDatePopoverOpen(false);
  };

  return (
    <div className={cn("grid lg:grid-cols-12 gap-6 p-6", className)}>
      <div className="lg:col-span-8 space-y-6 animate-fade-in">
        <Tabs defaultValue="buy" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-medium">Recommendations</h2>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="p-2 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center" 
                        onClick={clearDate}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
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
            <div className="grid sm:grid-cols-2 gap-4">
              {buyStocks.length > 0 ? (
                buyStocks.map((stock, index) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    selectedDate={selectedDate}
                    className={cn(
                      "animate-fade-in",
                      index === 0 ? "" : "animation-delay-200",
                      index === 1 ? "animation-delay-200" : "",
                      index === 2 ? "animation-delay-400" : "",
                      index === 3 ? "animation-delay-600" : ""
                    )} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No buy recommendations available for the selected date.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sell" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {sellStocks.length > 0 ? (
                sellStocks.map((stock, index) => (
                  <StockCard 
                    key={stock.symbol} 
                    stock={stock} 
                    selectedDate={selectedDate}
                    className={cn(
                      "animate-fade-in",
                      index === 0 ? "" : "animation-delay-200",
                      index === 1 ? "animation-delay-200" : "",
                      index === 2 ? "animation-delay-400" : "",
                      index === 3 ? "animation-delay-600" : ""
                    )} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No sell recommendations available for the selected date.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-4 space-y-6 animate-fade-in animation-delay-200">
        <Summary />
        <MarketOverview selectedDate={selectedDate} />
      </div>
    </div>
  );
}
