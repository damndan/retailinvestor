
// Mock data for the application

// Buy recommendations
export const buyRecommendations = [
  {
    symbol: "PLTR",
    name: "Palantir Technologies Inc.",
    price: 22.35,
    change: 0.87,
    changePercent: 4.05,
    recommendation: "buy" as const,
    confidence: 88,
    analysis: "Strong growth in government contracts and expansion into commercial sector. Increasing adoption of AI platforms positions Palantir well for future growth."
  },
  {
    symbol: "SOFI",
    name: "SoFi Technologies, Inc.",
    price: 7.82,
    change: 0.31,
    changePercent: 4.13,
    recommendation: "buy" as const,
    confidence: 85,
    analysis: "Digital banking growth, expanding product offerings, and improving profitability metrics. Bank charter and student loan recovery are positive catalysts."
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    price: 164.75,
    change: 2.18,
    changePercent: 1.34,
    recommendation: "buy" as const,
    confidence: 92,
    analysis: "Market share gains against Intel, strong data center growth, and AI chip expansion make AMD a compelling investment in the semiconductor space."
  },
  {
    symbol: "CRSR",
    name: "Corsair Gaming, Inc.",
    price: 11.24,
    change: 0.38,
    changePercent: 3.50,
    recommendation: "buy" as const,
    confidence: 84,
    analysis: "Leading gaming peripherals company with strong brand loyalty. Expanding product portfolio and potential gaming market recovery provide upside potential."
  }
];

// Sell recommendations
export const sellRecommendations = [
  {
    symbol: "GME",
    name: "GameStop Corp.",
    price: 15.21,
    change: -1.05,
    changePercent: -6.46,
    recommendation: "sell" as const,
    confidence: 78,
    analysis: "Challenging retail environment, declining store traffic, and lack of clear turnaround strategy. Despite meme stock status, fundamentals remain weak."
  },
  {
    symbol: "AMC",
    name: "AMC Entertainment Holdings, Inc.",
    price: 4.26,
    change: -0.15,
    changePercent: -3.40,
    recommendation: "sell" as const,
    confidence: 76,
    analysis: "High debt burden, ongoing cinema attendance challenges, and dilution of shareholders makes AMC's long-term viability questionable."
  },
  {
    symbol: "BBBY",
    name: "Bed Bath & Beyond Inc.",
    price: 0.04,
    change: -0.01,
    changePercent: -20.00,
    recommendation: "sell" as const,
    confidence: 95,
    analysis: "Bankruptcy proceedings and limited recovery potential for common shareholders. The company's restructuring is unlikely to generate value for current investors."
  },
  {
    symbol: "HOOD",
    name: "Robinhood Markets, Inc.",
    price: 18.75,
    change: -0.42,
    changePercent: -2.19,
    recommendation: "hold" as const,
    confidence: 62,
    analysis: "Volatile trading revenue, regulatory challenges, and increasing competition in the retail brokerage space. However, growing crypto trading and cash management services provide some optimism."
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
