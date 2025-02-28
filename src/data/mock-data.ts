
// Mock data for the application

// Buy recommendations
export const buyRecommendations = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.68,
    change: 1.24,
    changePercent: 0.66,
    recommendation: "buy" as const,
    confidence: 92,
    analysis: "Strong earnings, new product cycle, and service growth makes Apple a compelling buy. The company's ecosystem continues to expand with high customer retention."
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 412.76,
    change: 2.86,
    changePercent: 0.70,
    recommendation: "buy" as const,
    confidence: 89,
    analysis: "Cloud growth, AI integration and enterprise dominance position Microsoft for continued outperformance. The Azure platform shows exceptional momentum."
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 868.95,
    change: 15.32,
    changePercent: 1.79,
    recommendation: "buy" as const,
    confidence: 95,
    analysis: "Leading AI chip provider with unmatched growth in data center and gaming. The company's technology lead in AI acceleration creates a significant moat."
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 176.85,
    change: 0.47,
    changePercent: 0.27,
    recommendation: "buy" as const,
    confidence: 87,
    analysis: "E-commerce dominance, AWS growth, and advertising expansion create multiple revenue streams. The company continues to innovate across all business segments."
  }
];

// Sell recommendations
export const sellRecommendations = [
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    price: 116.01,
    change: -1.95,
    changePercent: -1.65,
    recommendation: "sell" as const,
    confidence: 78,
    analysis: "Facing significant challenges from energy transition and regulatory pressure. The company's long-term growth prospects are limited by global shifts away from fossil fuels."
  },
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 155.59,
    change: -2.10,
    changePercent: -1.33,
    recommendation: "sell" as const,
    confidence: 76,
    analysis: "Declining profit margins, regulatory headwinds, and increasing competition from renewable energy. The company faces significant transition risks."
  },
  {
    symbol: "BA",
    name: "The Boeing Company",
    price: 179.54,
    change: -5.23,
    changePercent: -2.83,
    recommendation: "sell" as const,
    confidence: 83,
    analysis: "Ongoing safety concerns, production issues, and competitive pressures from Airbus. The company faces significant challenges in regaining market trust."
  },
  {
    symbol: "KO",
    name: "The Coca-Cola Company",
    price: 60.72,
    change: -0.18,
    changePercent: -0.30,
    recommendation: "hold" as const,
    confidence: 62,
    analysis: "Slowing growth, changing consumer preferences toward healthier options, and increasing competition. However, strong brand and dividends provide some stability."
  }
];

// Market overview data
export const marketOverviewData = {
  indices: [
    {
      name: "S&P 500",
      value: 5628.87,
      prevValue: 5615.32,
      change: 0.24
    },
    {
      name: "NASDAQ",
      value: 18286.97,
      prevValue: 18172.60,
      change: 0.63
    },
    {
      name: "DOW JONES",
      value: 42185.29,
      prevValue: 42118.96,
      change: 0.16
    }
  ],
  chart: [
    {
      date: "Apr 1",
      sp500: 5200,
      nasdaq: 16800,
      dowjones: 39250
    },
    {
      date: "Apr 5",
      sp500: 5275,
      nasdaq: 17100,
      dowjones: 39500
    },
    {
      date: "Apr 10",
      sp500: 5320,
      nasdaq: 17300,
      dowjones: 39800
    },
    {
      date: "Apr 15",
      sp500: 5380,
      nasdaq: 17500,
      dowjones: 40200
    },
    {
      date: "Apr 20",
      sp500: 5450,
      nasdaq: 17800,
      dowjones: 41000
    },
    {
      date: "Apr 25",
      sp500: 5550,
      nasdaq: 18000,
      dowjones: 41600
    },
    {
      date: "Apr 30",
      sp500: 5629,
      nasdaq: 18287,
      dowjones: 42185
    }
  ]
};
