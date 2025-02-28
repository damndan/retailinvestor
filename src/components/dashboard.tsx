
import { useEffect, useState } from "react";
import { MarketOverview } from "./market/market-overview";
import { StockRecommendations } from "./stock-recommendations";
import { Summary } from "./summary";
import { NewsSection } from "./news/news-section";

export function Dashboard() {
  // Use today's date for the dashboard
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <MarketOverview selectedDate={selectedDate} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StockRecommendations type="buy" selectedDate={selectedDate} />
              <StockRecommendations type="sell" selectedDate={selectedDate} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Summary />
          <NewsSection />
        </div>
      </div>
    </div>
  );
}
