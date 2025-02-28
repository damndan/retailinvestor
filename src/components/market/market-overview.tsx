
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { useState } from "react";
import { MarketChart } from "./market-chart";
import { MarketIndexButtons } from "./market-index-buttons";
import { MarketIndices } from "./market-indices";

interface MarketData {
  name: string;
  value: number;
  prevValue: number;
  change: number;
}

export interface MarketOverviewProps {
  data: {
    indices: MarketData[];
    chart: Array<{
      date: string;
      sp500: number;
      nasdaq: number;
      dowjones: number;
    }>;
  };
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const [activeIndex, setActiveIndex] = useState("sp500");

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-4 w-4 text-info" />
            Market Overview
          </CardTitle>
          <MarketIndexButtons activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
        <CardDescription>Major indices performance</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <MarketChart data={data.chart} activeIndex={activeIndex} />
        <MarketIndices indices={data.indices} />
      </CardContent>
    </Card>
  );
}
