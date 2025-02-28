
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Summary() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          Daily Summary
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-4">
          <p className="leading-relaxed">
            Our AI analysis shows strong buy signals in technology and healthcare sectors, while suggesting caution in energy and retail.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Top performers</span>: AAPL and MSFT showing strong growth potential based on earnings forecasts.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Underperformers</span>: XOM and CVX facing headwinds due to regulatory challenges.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Strategy</span>: Consider portfolio rebalancing with higher allocation to tech and healthcare.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
