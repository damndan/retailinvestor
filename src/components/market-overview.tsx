
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MarketData {
  name: string;
  value: number;
  prevValue: number;
  change: number;
}

interface MarketOverviewProps {
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

  const getLineColor = (value: string) => {
    if (value === "sp500") return "hsl(var(--info))";
    if (value === "nasdaq") return "hsl(var(--success))";
    return "hsl(var(--warning))";
  };

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-4 w-4 text-info" />
            Market Overview
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0",
                activeIndex === "sp500" &&
                  "bg-info/10 text-info hover:text-info hover:bg-info/20"
              )}
              onClick={() => setActiveIndex("sp500")}
            >
              <span className="sr-only">Show S&P 500</span>
              <span className="text-xs font-medium">S&P</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0",
                activeIndex === "nasdaq" &&
                  "bg-success/10 text-success hover:text-success hover:bg-success/20"
              )}
              onClick={() => setActiveIndex("nasdaq")}
            >
              <span className="sr-only">Show NASDAQ</span>
              <span className="text-xs font-medium">NDQ</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0",
                activeIndex === "dowjones" &&
                  "bg-warning/10 text-warning hover:text-warning hover:bg-warning/20"
              )}
              onClick={() => setActiveIndex("dowjones")}
            >
              <span className="sr-only">Show Dow Jones</span>
              <span className="text-xs font-medium">DJI</span>
            </Button>
          </div>
        </div>
        <CardDescription>Major indices performance</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <div className="h-[180px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.chart}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorSP500" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNasdaq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDowJones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickMargin={5}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickFormatter={(value) => `${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{
                  color: 'hsl(var(--foreground))',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
                itemStyle={{
                  color: getLineColor(activeIndex),
                  fontSize: '12px',
                }}
              />
              {activeIndex === "sp500" && (
                <Area
                  type="monotone"
                  dataKey="sp500"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSP500)"
                  animationDuration={500}
                />
              )}
              {activeIndex === "nasdaq" && (
                <Area
                  type="monotone"
                  dataKey="nasdaq"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNasdaq)"
                  animationDuration={500}
                />
              )}
              {activeIndex === "dowjones" && (
                <Area
                  type="monotone"
                  dataKey="dowjones"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDowJones)"
                  animationDuration={500}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {data.indices.map((index) => (
            <div key={index.name} className="text-center">
              <p className="text-xs text-muted-foreground">{index.name}</p>
              <p className="text-sm font-medium">{index.value.toLocaleString()}</p>
              <div className={cn(
                "flex items-center justify-center text-xs",
                index.change > 0 ? "text-success" : "text-destructive"
              )}>
                {index.change > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                <span>{index.change > 0 ? "+" : ""}{index.change.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
