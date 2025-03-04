import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MarketIndicesProps {
  indices: Array<{
    name: string;
    value: number;
    prevValue: number;
    change: number;
  }>;
}

export function MarketIndices({ indices }: MarketIndicesProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {indices.map((index) => (
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
            <span>
              {index.change > 0 ? "+" : ""}{index.change.toFixed(2)} ({index.change > 0 ? "+" : ""}{((index.change / index.prevValue) * 100).toFixed(2)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
