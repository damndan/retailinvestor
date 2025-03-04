import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { MarketChart } from "./market-chart";
import { MarketIndices } from "./market-indices";
import { 
  fetchMarketIndices, 
  refreshMarketIndices,
  generateChartData, 
  MarketIndex,
  ChartData,
  shouldRefreshData,
  markDataRefreshed
} from "@/services/financial-service";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketOverviewProps {
  selectedDate?: Date | null;
}

export function MarketOverview({ selectedDate }: MarketOverviewProps) {
  const [activeIndex, setActiveIndex] = useState("sp500");
  // Initialize with empty arrays instead of mock data
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch market data when component mounts, selectedDate changes, or when a new day begins
  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoading(true);
      try {
        const fetchedIndices = await fetchMarketIndices();
        setIndices(fetchedIndices);
        
        // Update to handle the async function
        const fetchedChartData = await generateChartData();
        setChartData(fetchedChartData);
        
        // Mark data as refreshed
        markDataRefreshed();
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Initialize with empty arrays instead of falling back to mock data
        setIndices([]);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if we need to refresh data (new day)
    if (shouldRefreshData()) {
      console.log("New day detected, refreshing market data...");
      loadMarketData();
    } else {
      loadMarketData();
    }
  }, [selectedDate]);

  // Handler for refreshing market data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refresh of market indices
      const freshIndices = await refreshMarketIndices();
      setIndices(freshIndices);
      
      // Generate new chart data based on fresh indices
      const freshChartData = await generateChartData();
      setChartData(freshChartData);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing market data:", error);
    } finally {
      setRefreshing(false);
    }
  };

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

  // Debug effect
  useEffect(() => {
    if (chartData.length > 0) {
      console.log("Debug - activeIndex:", activeIndex);
      console.log("Debug - chart data sample:", chartData[0]);
    }
  }, [activeIndex, chartData]);

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

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-4 w-4 text-info" />
            Market Overview
            {isLoading && <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>}
          </CardTitle>
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
        {isLoading ? (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            Loading market data...
          </div>
        ) : noDataForSelectedDate ? (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            No market data available for the selected date
          </div>
        ) : indices.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            No market data available. Please try again later.
          </div>
        ) : (
          <Tabs defaultValue="sp500" onValueChange={setActiveIndex} value={activeIndex}>
            {indices.map((index) => {
              // Normalize index name to match the expected format in the chart component
              let indexValue = index.name.toLowerCase().replace(/\s+/g, '');
              
              // Special case for Dow Jones to match "dowjones" in the chart data
              if (index.name === "Dow Jones") {
                indexValue = "dowjones";
              }
              
              const isPositive = index.change >= 0;
              
              return (
                <TabsContent key={index.name} value={indexValue} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{formatNumber(index.value)}</h3>
                      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        <span className="flex items-center">
                          {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                          {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{((index.change / index.prevValue) * 100).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <MarketChart data={filteredChartData} activeIndex={indexValue} />
                </TabsContent>
              );
            })}
          </Tabs>
        )}
        {indices.length > 0 && <MarketIndices indices={indices} />}
      </CardContent>
    </Card>
  );
}
