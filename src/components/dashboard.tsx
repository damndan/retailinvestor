import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockCard } from "@/components/stock-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Summary } from "@/components/summary";
import { MarketOverview } from "@/components/market/market-overview";
import { cn } from "@/lib/utils";

// Mock data
import { buyRecommendations, sellRecommendations, marketOverviewData } from "@/data/mock-data";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  return (
    <div className={cn("grid lg:grid-cols-12 gap-6 p-6", className)}>
      <div className="lg:col-span-8 space-y-6 animate-fade-in">
        <Tabs defaultValue="buy" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-medium">Recommendations</h2>
            <TabsList>
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="buy" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {buyRecommendations.map((stock, index) => (
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
              {sellRecommendations.map((stock, index) => (
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
        <MarketOverview data={marketOverviewData} />
      </div>
    </div>
  );
}
