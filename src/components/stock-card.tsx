
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Info, TrendingDown, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface StockCardProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    recommendation: "buy" | "sell" | "hold";
    confidence: number;
    analysis: string;
    date?: Date;
  };
  className?: string;
}

export function StockCard({ stock, className }: StockCardProps) {
  const isPositive = stock.change >= 0;
  
  const confidenceLevel = () => {
    if (stock.confidence >= 80) return "High";
    if (stock.confidence >= 50) return "Medium";
    return "Low";
  };
  
  const confidenceColor = () => {
    if (stock.confidence >= 80) return "bg-success/10 text-success";
    if (stock.confidence >= 50) return "bg-warning/10 text-warning";
    return "bg-muted/30 text-muted-foreground";
  };
  
  const recommendationBadge = () => {
    if (stock.recommendation === "buy") {
      return (
        <Badge variant="outline" className="bg-success/10 text-success hover:bg-success/20 transition-colors">
          Strong Buy
        </Badge>
      );
    }
    if (stock.recommendation === "sell") {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
          Strong Sell
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted/30 text-muted-foreground hover:bg-muted/40 transition-colors">
        Hold
      </Badge>
    );
  };

  return (
    <Card className={cn("overflow-hidden glass-card border transition-all hover:shadow-md", className)}>
      <CardHeader className="p-4 pb-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-full bg-muted/30 flex items-center justify-center">
              <span className="font-semibold text-sm">{stock.symbol.substring(0, 2)}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base">{stock.symbol}</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px]">
                      <p className="text-xs">{stock.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-xs">
                {stock.name.length > 25 ? `${stock.name.substring(0, 25)}...` : stock.name}
              </CardDescription>
            </div>
          </div>
          {recommendationBadge()}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-medium">${stock.price.toFixed(2)}</span>
          <div className={cn(
            "flex items-center text-sm font-medium space-x-1",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        
        <div className="space-y-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <Badge variant="outline" className={cn("font-normal", confidenceColor())}>
              {confidenceLevel()} ({stock.confidence}%)
            </Badge>
          </div>
          
          {stock.date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>as of {format(new Date(stock.date), "PP")}</span>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stock.analysis.length > 120 ? `${stock.analysis.substring(0, 120)}...` : stock.analysis}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
