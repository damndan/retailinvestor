
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockCard } from "@/components/stock-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Mock data
import { buyRecommendations, sellRecommendations } from "@/data/mock-data";
import { updateRecommendationsWithRealData } from "@/services/financial-service";

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
}

export function Dashboard({ className }: DashboardProps) {
  const [buyStocks, setBuyStocks] = useState<StockRecommendation[]>(buyRecommendations);
  const [sellStocks, setSellStocks] = useState<StockRecommendation[]>(sellRecommendations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStockData = async () => {
      try {
        setIsLoading(true);
        
        // Update buy recommendations with real data
        const updatedBuyStocks = await updateRecommendationsWithRealData(buyRecommendations);
        setBuyStocks(updatedBuyStocks);
        
        // Update sell recommendations with real data
        const updatedSellStocks = await updateRecommendationsWithRealData(sellRecommendations);
        setSellStocks(updatedSellStocks);
      } catch (error) {
        console.error("Failed to fetch real stock data:", error);
        // Fallback to mock data
        setBuyStocks(buyRecommendations);
        setSellStocks(sellRecommendations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealStockData();
  }, []);

  return (
    <div className={cn("grid lg:grid-cols-12 gap-6 p-6", className)}>
      <div className="lg:col-span-8 space-y-6 animate-fade-in">
        <Tabs defaultValue="buy" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-medium">Recommendations</h2>
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
              {buyStocks.map((stock, index) => (
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
          </TabsContent>
          
          <TabsContent value="sell" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {sellStocks.map((stock, index) => (
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-4 space-y-6 animate-fade-in animation-delay-200">
        <Summary />
        <MarketOverview />
      </div>
    </div>
  );
}
