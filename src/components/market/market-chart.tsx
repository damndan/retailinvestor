
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MarketChartProps {
  data: Array<{
    date: string;
    sp500: number;
    nasdaq: number;
    dowjones: number;
  }>;
  activeIndex: string;
}

export function MarketChart({ data, activeIndex }: MarketChartProps) {
  const getLineColor = (value: string) => {
    if (value === "sp500") return "hsl(var(--info))";
    if (value === "nasdaq") return "hsl(var(--success))";
    return "hsl(var(--warning))";
  };

  return (
    <div className="h-[180px] mt-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
  );
}
