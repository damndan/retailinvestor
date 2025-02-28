
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StockCard } from "@/components/stock-card";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { buyRecommendations, sellRecommendations } from "@/data/mock-data";

export function Dashboard() {
  const [date, setDate] = useState<Date | null>(null);
  const [buyRecs, setBuyRecs] = useState(buyRecommendations);
  const [sellRecs, setSellRecs] = useState(sellRecommendations);
  const [loading, setLoading] = useState(false);
  const [noDataForDate, setNoDataForDate] = useState(false);

  // Check if a date is today (same year, month, and day)
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Update recommendations whenever date changes
  useEffect(() => {
    const filterRecommendationsByDate = () => {
      setLoading(true);
      
      try {
        if (date) {
          // For today's date (Feb 28), always show all recommendations
          if (isToday(date)) {
            setBuyRecs(buyRecommendations);
            setSellRecs(sellRecommendations);
            setNoDataForDate(false);
            setLoading(false);
            return;
          }

          // Format the selected date as YYYY-MM for comparison
          const selectedDateStr = format(date, 'yyyy-MM');
          
          // Filter buy recommendations by date (comparing only year and month)
          const filteredBuyRecs = buyRecommendations.filter(rec => {
            if (!rec.date) return false;
            return rec.date.substring(0, 7) === selectedDateStr;
          });
          
          // Filter sell recommendations by date (comparing only year and month)
          const filteredSellRecs = sellRecommendations.filter(rec => {
            if (!rec.date) return false;
            return rec.date.substring(0, 7) === selectedDateStr;
          });
          
          setBuyRecs(filteredBuyRecs);
          setSellRecs(filteredSellRecs);
          
          // Set flag if no data for the selected date
          setNoDataForDate(filteredBuyRecs.length === 0 && filteredSellRecs.length === 0);
        } else {
          // If no date selected (including reset to null), show all recommendations
          setBuyRecs(buyRecommendations);
          setSellRecs(sellRecommendations);
          setNoDataForDate(false);
        }
      } catch (error) {
        console.error("Error filtering recommendations:", error);
        // Fallback to all recommendations
        setBuyRecs(buyRecommendations);
        setSellRecs(sellRecommendations);
        setNoDataForDate(false);
      } finally {
        setLoading(false);
      }
    };

    filterRecommendationsByDate();
  }, [date]);

  // Handler for clearing date selection
  const handleClearDate = () => {
    setDate(null);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {date && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearDate}
              className="h-10"
            >
              Reset
            </Button>
          )}
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
                      <StockCard key={stock.symbol} stock={stock} selectedDate={date} />
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
                      <StockCard key={stock.symbol} stock={stock} selectedDate={date} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div>
          <Summary />
        </div>
      </div>
    </div>
  );
}
