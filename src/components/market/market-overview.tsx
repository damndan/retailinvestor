
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
import { format } from "date-fns";

interface MarketOverviewProps {
  selectedDate?: Date;
}

export function MarketOverview({ selectedDate }: MarketOverviewProps) {
  const [activeIndex, setActiveIndex] = useState("sp500");
  const [indices, setIndices] = useState<MarketIndex[]>(marketOverviewData.indices);
  const [chartData, setChartData] = useState<ChartData[]>(marketOverviewData.chart);
  const [isLoading, setIsLoading] = useState(true);
  const [originalChartData, setOriginalChartData] = useState<ChartData[]>(marketOverviewData.chart);

  const getAdjustedChartData = (allData: ChartData[], date?: Date): ChartData[] => {
    if (!date) return allData;
    
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();
    
    return allData.filter(dataPoint => {
      const [monthStr, yearStr] = dataPoint.date.split(' ');
      const month = getMonthFromString(monthStr);
      const year = parseInt(yearStr);
      
      return (year < selectedYear) || (year === selectedYear && month <= selectedMonth);
    });
  };

  const getMonthFromString = (monthStr: string): number => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(monthStr);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const marketIndices = await fetchMarketIndices();
        setIndices(marketIndices);
        
        const generatedChartData = generateChartData(marketIndices);
        setChartData(generatedChartData);
        setOriginalChartData(generatedChartData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setIndices(marketOverviewData.indices);
        setChartData(marketOverviewData.chart);
        setOriginalChartData(marketOverviewData.chart);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (originalChartData.length > 0) {
      const adjustedData = getAdjustedChartData(originalChartData, selectedDate);
      setChartData(adjustedData);
    }
  }, [selectedDate, originalChartData]);

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
            ? `Performance as of ${format(selectedDate, "PP")}`
            : "Major indices performance"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <MarketChart data={chartData} activeIndex={activeIndex} />
        <MarketIndices indices={indices} />
      </CardContent>
    </Card>
  );
}
