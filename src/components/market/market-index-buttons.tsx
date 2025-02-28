
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketIndexButtonsProps {
  activeIndex: string;
  setActiveIndex: (index: string) => void;
}

export function MarketIndexButtons({ activeIndex, setActiveIndex }: MarketIndexButtonsProps) {
  return (
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
  );
}
