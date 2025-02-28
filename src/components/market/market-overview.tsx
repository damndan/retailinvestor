
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
  ChartData 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const marketIndices = await fetchMarketIndices();
        setIndices(marketIndices);
        
        // Generate chart data based on current indices
        const generatedChartData = generateChartData(marketIndices);
        setChartData(generatedChartData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Fallback to mock data
        setIndices(marketOverviewData.indices);
        setChartData(marketOverviewData.chart);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Filter chart data based on selected date
  const filteredChartData = selectedDate 
    ? chartData.filter(data => {
        // Parse the chart data date string (format: "Jan 2019")
        const [month, year] = data.date.split(' ');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = months.indexOf(month);
        
        if (monthIndex === -1) return false;
        
        // Create date objects for comparison (using the 1st day of the month)
        const chartDate = new Date(parseInt(year), monthIndex, 1);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        
        // Compare year and month only
        return chartDate.getFullYear() === selectedYear && chartDate.getMonth() === selectedMonth;
      })
    : chartData;

  // If there's a selected date but no matching chart data, show a message
  const noDataForSelectedDate = selectedDate && filteredChartData.length === 0;

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
