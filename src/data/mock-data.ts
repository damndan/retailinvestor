
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
    analysis: "Strong growth in government contracts and expansion into commercial sector. Increasing adoption of AI platforms positions Palantir well for future growth.",
    date: "2024-01-15"
  },
  {
    symbol: "SOFI",
    name: "SoFi Technologies, Inc.",
    price: 7.82,
    change: 0.31,
    changePercent: 4.13,
    recommendation: "buy" as const,
    confidence: 85,
    analysis: "Digital banking growth, expanding product offerings, and improving profitability metrics. Bank charter and student loan recovery are positive catalysts.",
    date: "2024-02-20"
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    price: 178.63,
    change: 2.18,
    changePercent: 1.34,
    recommendation: "buy" as const,
    confidence: 92,
    analysis: "Market share gains against Intel, strong data center growth, and AI chip expansion make AMD a compelling investment in the semiconductor space.",
    date: "2024-03-10"
  },
  {
    symbol: "CRSR",
    name: "Corsair Gaming, Inc.",
    price: 11.24,
    change: 0.38,
    changePercent: 3.50,
    recommendation: "buy" as const,
    confidence: 84,
    analysis: "Leading gaming peripherals company with strong brand loyalty. Expanding product portfolio and potential gaming market recovery provide upside potential.",
    date: "2024-07-01"
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
    analysis: "Challenging retail environment, declining store traffic, and lack of clear turnaround strategy. Despite meme stock status, fundamentals remain weak.",
    date: "2024-01-05"
  },
  {
    symbol: "AMC",
    name: "AMC Entertainment Holdings, Inc.",
    price: 4.26,
    change: -0.15,
    changePercent: -3.40,
    recommendation: "sell" as const,
    confidence: 76,
    analysis: "High debt burden, ongoing cinema attendance challenges, and dilution of shareholders makes AMC's long-term viability questionable.",
    date: "2024-02-15"
  },
  {
    symbol: "BBBY",
    name: "Bed Bath & Beyond Inc.",
    price: 0.04,
    change: -0.01,
    changePercent: -20.00,
    recommendation: "sell" as const,
    confidence: 95,
    analysis: "Bankruptcy proceedings and limited recovery potential for common shareholders. The company's restructuring is unlikely to generate value for current investors.",
    date: "2024-04-20"
  },
  {
    symbol: "HOOD",
    name: "Robinhood Markets, Inc.",
    price: 18.75,
    change: -0.42,
    changePercent: -2.19,
    recommendation: "hold" as const,
    confidence: 62,
    analysis: "Volatile trading revenue, regulatory challenges, and increasing competition in the retail brokerage space. However, growing crypto trading and cash management services provide some optimism.",
    date: "2024-07-10"
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
      date: "Jan 2019",
      sp500: 2704,
      nasdaq: 7281,
      dowjones: 24999
    },
    {
      date: "Jul 2019",
      sp500: 2980,
      nasdaq: 8175,
      dowjones: 26864
    },
    {
      date: "Jan 2020",
      sp500: 3225,
      nasdaq: 9150,
      dowjones: 28256
    },
    {
      date: "Jul 2020",
      sp500: 3271,
      nasdaq: 10745,
      dowjones: 26428
    },
    {
      date: "Jan 2021",
      sp500: 3714,
      nasdaq: 13070,
      dowjones: 29982
    },
    {
      date: "Jul 2021",
      sp500: 4395,
      nasdaq: 14672,
      dowjones: 34935
    },
    {
      date: "Jan 2022",
      sp500: 4515,
      nasdaq: 14239,
      dowjones: 35131
    },
    {
      date: "Jul 2022",
      sp500: 4130,
      nasdaq: 12390,
      dowjones: 32845
    },
    {
      date: "Jan 2023",
      sp500: 3978,
      nasdaq: 11621,
      dowjones: 33945
    },
    {
      date: "Jul 2023",
      sp500: 4588,
      nasdaq: 14346,
      dowjones: 35459
    },
    {
      date: "Jan 2024",
      sp500: 4845,
      nasdaq: 15628,
      dowjones: 38150
    },
    {
      date: "Jul 2024",
      sp500: 5629,
      nasdaq: 18287,
      dowjones: 42185
    }
  ]
};
