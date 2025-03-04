// Types for market and financial data

export interface MarketIndex {
  name: string;
  value: number;
  prevValue: number;
  change: number;
}

export interface ChartData {
  date: string;
  sp500: number;
  nasdaq: number;
  dowjones: number;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  confidence?: number;
  analysis?: string;
  targetPrice?: number; // Target price for the stock
  date?: string; // Date when this recommendation was made
  isRetailFavorite?: boolean; // Indicates if this is a popular stock among retail investors
  sources?: { name: string; url: string }[];
}
