
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Summary() {
  const [date, setDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState({
    topPerformers: ["AAPL", "MSFT"],
    underperformers: ["XOM", "CVX"],
    sectors: {
      strong: ["technology", "healthcare"],
      weak: ["energy", "retail"]
    },
    strategy: "Consider portfolio rebalancing with higher allocation to tech and healthcare."
  });
  
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Check if we need to refresh the summary (new day)
  useEffect(() => {
    const checkForNewDay = () => {
      const currentDay = (new Date()).getDate();
      const currentMonth = (new Date()).getMonth();
      const currentYear = (new Date()).getFullYear();
      
      const prevDay = date.getDate();
      const prevMonth = date.getMonth();
      const prevYear = date.getFullYear();
      
      // If the date has changed, update the summary
      if (currentDay !== prevDay || currentMonth !== prevMonth || currentYear !== prevYear) {
        setDate(new Date());
        generateDailySummary();
      }
    };
    
    // Check for a new day every 5 minutes
    const intervalId = setInterval(checkForNewDay, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [date]);
  
  // Function to generate a fresh daily summary
  const generateDailySummary = () => {
    // In a real app, this would fetch data from an API
    // For now, we'll just randomize some elements to simulate fresh data
    
    const techStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"];
    const healthStocks = ["JNJ", "PFE", "UNH", "ABBV", "MRK"];
    const energyStocks = ["XOM", "CVX", "BP", "COP", "SLB"];
    const retailStocks = ["WMT", "TGT", "COST", "HD", "LOW", "AMZN"];
    
    // Randomly select 2 top performers
    const topPerformers = [
      techStocks[Math.floor(Math.random() * techStocks.length)],
      healthStocks[Math.floor(Math.random() * healthStocks.length)]
    ];
    
    // Randomly select 2 underperformers
    const underperformers = [
      energyStocks[Math.floor(Math.random() * energyStocks.length)],
      retailStocks[Math.floor(Math.random() * retailStocks.length)]
    ];
    
    // Possible sector combinations
    const sectorCombinations = [
      { strong: ["technology", "healthcare"], weak: ["energy", "retail"] },
      { strong: ["technology", "financials"], weak: ["utilities", "real estate"] },
      { strong: ["healthcare", "consumer staples"], weak: ["energy", "materials"] },
      { strong: ["technology", "consumer discretionary"], weak: ["utilities", "telecommunications"] }
    ];
    
    const selectedSectors = sectorCombinations[Math.floor(Math.random() * sectorCombinations.length)];
    
    // Possible strategies
    const strategies = [
      "Consider portfolio rebalancing with higher allocation to tech and healthcare.",
      "Diversification across strong sectors recommended with defensive positioning.",
      "Focus on high-quality stocks with strong balance sheets in current environment.",
      "Selective approach advised, targeting stocks with reasonable valuations in strong sectors."
    ];
    
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    
    // Update the summary data
    setSummaryData({
      topPerformers,
      underperformers,
      sectors: selectedSectors,
      strategy
    });
  };
  
  // Generate a fresh summary when the component mounts
  useEffect(() => {
    generateDailySummary();
  }, []);

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
            Our AI analysis shows strong buy signals in {summaryData.sectors.strong.join(" and ")} sectors, 
            while suggesting caution in {summaryData.sectors.weak.join(" and ")}.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Top performers</span>: {summaryData.topPerformers.join(" and ")} showing strong growth potential based on earnings forecasts.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Underperformers</span>: {summaryData.underperformers.join(" and ")} facing headwinds due to regulatory challenges.
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
              <p className={cn("text-sm")}>
                <span className="font-medium">Strategy</span>: {summaryData.strategy}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
