
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockCard } from "./stock-card";
import { getStockRecommendations } from "@/services/financial-service";

interface StockRecommendationsProps {
  type: "buy" | "sell";
  selectedDate: Date;
}

export function StockRecommendations({ type, selectedDate }: StockRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch recommendations based on type (buy or sell)
        const data = await getStockRecommendations(type, selectedDate);
        setRecommendations(data);
      } catch (error) {
        console.error(`Error fetching ${type} recommendations:`, error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, selectedDate]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            {type === "buy" ? "Buy Recommendations" : "Sell Recommendations"}
          </CardTitle>
          <Badge variant={type === "buy" ? "success" : "destructive"}>
            {type === "buy" ? "Buys" : "Sells"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} type={type} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No {type === "buy" ? "buy" : "sell"} recommendations available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
