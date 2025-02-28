
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { useState, useEffect } from "react";
import { MarketChart } from "./market-chart";
import { MarketIndexButtons } from "./market-index-buttons";
import { MarketIndices } from "./market-indices";
import { 
  fetchMarketIndices, 
  generateChartData, 
  MarketIndex,
  ChartData,
  shouldRefreshData,
  markDataRefreshed
} from "@/services/financial-service";
import { marketOverviewData } from "@/data/mock-data";

interface MarketOverviewProps {
  selectedDate?: Date | null;
}

export function MarketOverview({ selectedDate }: MarketOverviewProps) {
  const [activeIndex, setActiveIndex] = useState("sp500");
  const [indices, setIndices] = useState<MarketIndex[]>(marketOverviewData.indices);
  const [chartData, setChartData] = useState<ChartData[]>(marketOverviewData.chart);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch market data when component mounts, selectedDate changes, or when a new day begins
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const marketIndices = await fetchMarketIndices();
        setIndices(marketIndices);
        
        // Generate chart data based on current indices
        const generatedChartData = generateChartData(marketIndices);
        setChartData(generatedChartData);
        
        // Mark data as refreshed
        markDataRefreshed();
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Fallback to mock data
        setIndices(marketOverviewData.indices);
        setChartData(marketOverviewData.chart);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if we need to refresh data (new day)
    if (shouldRefreshData()) {
      console.log("New day detected, refreshing market data...");
      fetchData();
    } else {
      fetchData();
    }
  }, [selectedDate]);

  // Set up a timer to check for data refresh needs
  useEffect(() => {
    // Check every 5 minutes if we need to refresh data
    const intervalId = setInterval(() => {
      if (shouldRefreshData()) {
        console.log("Data refresh needed, reloading component...");
        setLastUpdated(new Date()); // This will trigger the data fetch
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  // Check if a date is today (same year, month, and day)
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Filter chart data based on selected date
  const filteredChartData = selectedDate 
    ? chartData.filter(data => {
        // For today's date, always show data
        if (isToday(selectedDate)) {
          // Find the most recent data point for today
          return true;
        }

        // Parse the chart data date string (format: "Jan 2019")
        const [month, year] = data.date.split(' ');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex === -1) return false;
        
        // Create date objects for comparison (using the 1st day of the month)
        const chartDate = new Date(parseInt(year), monthIndex);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        
        // Compare year and month only
        return chartDate.getFullYear() === selectedYear && chartDate.getMonth() === selectedMonth;
      })
    : chartData; // When no date is selected, show all chart data

  // If there's a selected date but no matching chart data, show a message
  // For today's date, we never show "no data" message
  const noDataForSelectedDate = selectedDate && 
                               filteredChartData.length === 0 && 
                               !isToday(selectedDate);

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-4 w-4 text-info" />
            Market Overview
            {isLoading && <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>}
          </CardTitle>
          <MarketIndexButtons activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
        <CardDescription>
          {selectedDate 
            ? `Market performance on ${selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}`
            : "Major indices performance"
          }
          <span className="text-xs ml-2 text-muted-foreground">
            (Last updated: {lastUpdated.toLocaleTimeString()})
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        {noDataForSelectedDate ? (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            No market data available for the selected date
          </div>
        ) : (
          <MarketChart 
            data={filteredChartData.length > 0 ? filteredChartData : chartData} 
            activeIndex={activeIndex} 
          />
        )}
        <MarketIndices indices={indices} />
      </CardContent>
    </Card>
  );
}
