
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
      value: 5021.84,
      prevValue: 5000.47,
      change: 0.43
    },
    {
      name: "NASDAQ",
      value: 15845.24,
      prevValue: 15712.75,
      change: 0.84
    },
    {
      name: "DOW JONES",
      value: 38239.66,
      prevValue: 38143.33,
      change: 0.25
    }
  ],
  chart: [
    {
      date: "Apr 1",
      sp500: 4900,
      nasdaq: 15200,
      dowjones: 37800
    },
    {
      date: "Apr 5",
      sp500: 4930,
      nasdaq: 15350,
      dowjones: 37950
    },
    {
      date: "Apr 10",
      sp500: 4905,
      nasdaq: 15300,
      dowjones: 37900
    },
    {
      date: "Apr 15",
      sp500: 4950,
      nasdaq: 15400,
      dowjones: 38000
    },
    {
      date: "Apr 20",
      sp500: 4980,
      nasdaq: 15600,
      dowjones: 38100
    },
    {
      date: "Apr 25",
      sp500: 5000,
      nasdaq: 15750,
      dowjones: 38150
    },
    {
      date: "Apr 30",
      sp500: 5022,
      nasdaq: 15845,
      dowjones: 38240
    }
  ]
};
