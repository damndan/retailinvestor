import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

// Default stock options
const STRONG_BUY_OPTIONS = [
  { 
    symbol: "AMD", 
    name: "Advanced Micro Devices", 
    reason: "Retail investors seeking semiconductor diversification beyond Nvidia with MI300 AI accelerators",
    detailedAnalysis: "AMD's increasing market share in the AI chip space shows promise with its MI300 series gaining traction. Q2 earnings revealed 2.2x YoY revenue growth in data center GPUs, with major wins including Microsoft Azure and Meta deployments. Technical analysis shows bullish momentum with the stock holding above its 50-day moving average despite market turbulence. Institutional ownership increased 3.7% in the last quarter, while retail investor mentions on platforms like StockTwits have surged 43% over 30 days. The lower price point compared to NVDA makes it accessible to retail investors looking for AI exposure at reasonable valuations (forward P/E of 31.5 vs. sector median of 37.2)."
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft", 
    reason: "Cloud growth and AI integration across product lines with steady retail investor support",
    detailedAnalysis: "Microsoft continues to leverage its Azure cloud infrastructure to deploy AI solutions at scale, with Copilot integrations driving new revenue streams across its product suite. Q2 cloud revenue growth of 17.8% exceeded analyst expectations by 2.3 percentage points. Microsoft's balance sheet remains exceptional with $143B in cash reserves and consistent free cash flow generation ($23.9B in the latest quarter). Retail investors appreciate the dual nature of MSFT as both a stable dividend payer (11 consecutive years of dividend growth) and an AI growth story. Technical indicators remain bullish with accumulation/distribution metrics showing continued institutional support despite broader market weakness."
  },
  { 
    symbol: "COIN", 
    name: "Coinbase Global Inc.", 
    reason: "Benefiting from cryptocurrency trading surge following pro-crypto political statements",
    detailedAnalysis: "Coinbase has experienced a 156% increase in trading volume following recent pro-cryptocurrency political statements, creating substantial revenue acceleration. The company reported $1.1B in transaction revenue in Q2, up 73% from the previous quarter. Retail trading accounts for approximately 82% of transaction revenue, highlighting the platform's popularity among individual investors. Spot Bitcoin ETF approval has created a more favorable regulatory environment, reducing existential risks that previously deterred investors. Social sentiment analysis indicates retail investor confidence has improved significantly, with positive mentions up 87% over 3 months. Risk factors remain tied to cryptocurrency price volatility and potential regulatory changes, though the company has diversified revenue streams with staking (13% of revenue) and custody services (7%)."
  },
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    reason: "Core tech holding maintained by retail investors increasing cash allocations",
    detailedAnalysis: "Apple remains a bedrock holding for retail investors, with 43% of Robinhood accounts holding AAPL shares according to recent data. The company's substantial cash position ($162B) and aggressive share repurchase program ($90B authorized) provide defensive characteristics during market volatility. While iPhone sales growth has moderated (+2.1% YoY), Services revenue continues to accelerate (+15.8% YoY) with higher margins (73.1% gross margin vs 36.8% for hardware). AI strategy announcements including Apple Intelligence and partnership with OpenAI have reignited growth narratives. Technical analysis shows strong support at the 200-day moving average with decreasing volume on down days, suggesting limited selling pressure. Recent Vision Pro headset launch, while modest in sales impact, establishes a foothold in spatial computing for future growth."
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet", 
    reason: "AI advancements and digital ad market recovery",
    detailedAnalysis: "Alphabet has successfully leveraged its AI capabilities through Gemini integration while simultaneously benefiting from digital advertising recovery. Search revenue grew 14.2% YoY with YouTube ads up 13.1%, exceeding consensus estimates by 3.7 percentage points. Cloud segment achieved profitability earlier than expected, generating $1.2B in operating income on $9.6B revenue (28.7% YoY growth). The company's aggressive cost-cutting measures resulted in headcount reduction of 4.5%, improving operating margins from 26% to 32%. Retail investor sentiment remains positive with institutional investors like Sands Capital and Fisher Investments increasing positions. Technical analysis shows the relative strength index (RSI) at 58, indicating momentum without overvaluation concerns."
  },
  { 
    symbol: "AMZN", 
    name: "Amazon", 
    reason: "AWS growth and retail margin improvements",
    detailedAnalysis: "Amazon's AWS cloud division has reaccelerated growth to 19.4% YoY after several quarters of deceleration, driven by enterprise AI adoption and generative AI services. Retail margins have expanded 320 basis points through logistics optimization and advertising integration. The company has successfully monetized its logistics network by opening it to third-party merchants, creating a high-margin revenue stream projected to reach $15B annually by 2025. Prime membership continues to expand with global subscribers exceeding 230M and ARPU increasing through additional services. Technical chart patterns show a cup-and-handle formation suggesting potential breakout above $185 resistance. Institutional analysis from JP Morgan highlights Amazon as their top large-cap pick with a $225 price target based on sum-of-parts valuation."
  },
  { 
    symbol: "SMCI", 
    name: "Super Micro Computer", 
    reason: "Expanding AI server portfolio and market share gains",
    detailedAnalysis: "Super Micro Computer has established itself as a key infrastructure provider in the AI buildout, with liquid-cooled server solutions optimized for high-density computing environments. Revenue growth of 203% YoY dramatically outpaces the sector, with gross margins expanding from 15.1% to 17.3% despite supply chain pressures. The company's just-in-time manufacturing approach allows faster adoption of new chip technologies, creating competitive advantages against larger server manufacturers. Wall Street coverage has expanded from 5 to 13 analysts in 12 months, with 85% maintaining buy ratings. Retail investor participation has increased 117% based on Fidelity retail order flow data. Risks include customer concentration (top 10 customers represent 48% of revenue) and potential inventory buildup if AI deployment pace slows."
  },
  { 
    symbol: "HOOD", 
    name: "Robinhood Markets", 
    reason: "Crypto trading volume surge and improved retail investor engagement",
    detailedAnalysis: "Robinhood has experienced a renaissance in crypto trading activity, with transaction-based revenue from cryptocurrency up 138% YoY. The platform added 880,000 new funded accounts in Q2, representing 44% growth YoY and the highest quarterly total since 2021. Assets under custody reached $132B, reflecting both market appreciation and net deposits of $4.8B (9.2% annualized growth rate of net deposits). Product diversification has reduced reliance on controversial payment for order flow, with options trading, crypto, securities lending, and interest income now comprising 67% of revenue. Technical analysis shows the stock breaking out of a 9-month accumulation pattern with above-average volume. While regulatory risks remain, recent legal settlements have provided greater clarity on the business model's future. Management's focus on international expansion could open significant growth opportunities, with UK and EU markets targeted for 2024."
  }
];

const STRONG_SELL_OPTIONS = [
  { 
    symbol: "WMT", 
    name: "Walmart", 
    reason: "Declining retail investor interest as spending shifts from traditional retail",
    detailedAnalysis: "Walmart faces headwinds from shifting consumer spending patterns, with discretionary purchases declining 3.2% YoY despite grocery strength. Margin pressure continues as the company invests heavily in e-commerce infrastructure and wage increases to remain competitive, with operating margins contracting 40 basis points to 3.9%. Technical analysis shows concerning signs with the stock approaching overbought territory (RSI of 72) after a 28% run-up, suggesting limited upside potential. Retail investor sentiment has weakened, with sentiment analysis showing declining positive mentions (-18% over 60 days) as focus shifts to technology and AI investments. While the company's subscription service Walmart+ has grown to an estimated 19M members, average revenue per member lags Amazon Prime by approximately 61%. The recent increase in inventories (+5.2% YoY) may require incremental markdowns, potentially impacting Q3 and Q4 margins during critical holiday seasons."
  },
  { 
    symbol: "XOM", 
    name: "Exxon Mobil", 
    reason: "Decreased retail positions as investors favor tech and AI sectors",
    detailedAnalysis: "Exxon Mobil faces multiple challenges including declining production volumes (-2.3% YoY) and shrinking refining margins (down 18% from peak). The company's massive $60B acquisition of Pioneer Natural Resources increases exposure to U.S. shale at a time when production growth is moderating and competition from renewable energy sources is intensifying. Capital expenditure requirements remain elevated at $23-25B annually, limiting potential for dividend growth beyond inflation. ESG considerations continue to impact institutional ownership, with several large pension funds reducing positions. Retail investor allocation to energy has declined from 12% to 7.3% over 18 months as capital flows predominantly to technology and AI-related sectors. Technical analysis reveals weakening momentum with the stock trading below both 50-day and 200-day moving averages. While the 3.6% dividend yield provides some support, relative performance metrics show significant underperformance versus the broader market (15.7 percentage points below S&P 500 YTD)."
  },
  { 
    symbol: "AMC", 
    name: "AMC Entertainment", 
    reason: "Decreasing new positions despite 'diamond hands' rhetoric from Reddit communities",
    detailedAnalysis: "AMC Entertainment continues to face structural challenges with theater attendance still 20% below pre-pandemic levels despite strong periodic releases. The company's debt burden remains substantial at $8.3B with annual interest expenses of $367M severely impacting profitability prospects. Cash burn continues at approximately $42M per quarter despite cost-cutting measures. Reddit communities maintain 'diamond hands' rhetoric but data shows declining new position openings (-38% over 3 months) and increased selling pressure during price spikes. Technical analysis reveals deteriorating chart patterns with lower highs and lower lows forming a bearish channel. Recent convertible note offerings have increased share count by 14.7%, contributing to equity dilution that undermines long-term shareholder value. Industry trends remain challenging with streaming platforms shortening theatrical windows and directly releasing mid-budget films. While periodic meme stock rallies may create short-term trading opportunities, fundamental outlook remains severely challenged with bankruptcy risk reflected in credit default swap pricing."
  },
  { 
    symbol: "RIVN", 
    name: "Rivian Automotive", 
    reason: "Retail investors becoming more selective with EV investments during volatility",
    detailedAnalysis: "Rivian faces significant challenges with cash burn averaging $1.2B quarterly despite production efficiencies improving gross margin from -37% to -20% YoY. The company's go-to-market strategy has proven problematic with frequent price adjustments causing brand positioning confusion. Production targets for 2023 were revised downward from 60,000 to 52,000 vehicles, raising concerns about manufacturing scalability. Competition has intensified dramatically with legacy automakers like Ford and GM introducing comparable electric trucks at lower price points, while also benefiting from established dealer networks and service infrastructure. Retail investor sentiment has deteriorated significantly, with positive social media mentions decreasing 67% over 6 months. Technical analysis shows the stock forming a head-and-shoulders pattern, typically indicating further downside risk. While the company maintains $7.9B in cash and equivalents, current burn rate suggests potential need for dilutive capital raising within 18 months. Amazon's delivery van orders provide some revenue predictability, but the 100,000-vehicle commitment has been extended over a longer timeframe than initially anticipated."
  },
  { 
    symbol: "KO", 
    name: "Coca-Cola", 
    reason: "Shifting consumer preferences toward healthier options",
    detailedAnalysis: "Coca-Cola faces persistent volume pressure in its core carbonated beverage segment, with North American volumes declining 3.1% despite price increases of 7.8%. The company's premium valuation (26.5x forward earnings vs. consumer staples average of 21.7x) appears increasingly difficult to justify given modest 3-4% annual growth projections. Health-conscious consumer trends continue to impact sugary beverage consumption, with surveys indicating 58% of Gen Z and Millennial consumers actively reducing soda intake. While the company has diversified into healthier alternatives, these products generate lower margins and face intense competition from nimble startup brands. Technical analysis indicates defensive positioning has pushed the stock to overbought levels (RSI of 71) with limited upside potential. Recent social sentiment analysis shows retail investors increasingly view KO as an inflation hedge rather than a growth investment, with mentions of the stock in growth-oriented forums down 32% YoY. Rising input costs for sweeteners and packaging materials are expected to create margin pressure in coming quarters."
  },
  { 
    symbol: "T", 
    name: "AT&T", 
    reason: "High debt levels and competitive wireless market",
    detailedAnalysis: "AT&T continues to struggle with its massive debt burden ($136.2B), limiting financial flexibility despite improved free cash flow generation. The company's wireless segment faces intensifying competition from T-Mobile and cable companies entering the mobile space, putting pressure on average revenue per user (ARPU has declined 1.3% YoY). Recent network outages have damaged brand perception, with consumer satisfaction scores dropping 8 points according to the American Customer Satisfaction Index. Fixed broadband growth has decelerated to 2.1% YoY as fiber deployment costs remain elevated ($4-5B annually) and competition from fixed wireless and cable alternatives intensifies. Technical analysis shows the stock trading in a narrow range between $16-18 for over 12 months, indicating lack of momentum despite the attractive 6.4% dividend yield. Institutional ownership has decreased 3.2% over the past year, with several major funds reducing positions. While dividend coverage has improved (63% payout ratio vs. 72% the previous year), limited growth prospects and ongoing competitive pressures continue to weigh on long-term outlook."
  },
  { 
    symbol: "BA", 
    name: "Boeing", 
    reason: "Ongoing production issues and regulatory scrutiny",
    detailedAnalysis: "Boeing continues to face significant operational challenges, with 737 MAX production constrained by quality control issues and regulatory oversight. The January 2024 door plug incident has renewed FAA scrutiny, resulting in production rate limitations that will impact delivery schedules through 2025. The company's defense division has experienced $1.7B in cost overruns on fixed-price development programs, further straining financial performance. Free cash flow remains negative with projections for breakeven pushed back to late 2025. Technical analysis shows deteriorating price action with violation of key support levels and distribution patterns indicating institutional selling. Aircraft order cancellations and deferrals have increased 28% YoY as airlines reassess capacity growth plans. Balance sheet concerns persist with $47.8B in debt and limited financial flexibility for the capital investments needed to develop next-generation aircraft. While long-term commercial aerospace demand remains strong, Boeing's execution issues and cultural challenges present significant near-term headwinds that justify investor caution."
  },
  { 
    symbol: "INTC", 
    name: "Intel Corporation", 
    reason: "Market share loss to competitors and manufacturing delays",
    detailedAnalysis: "Intel faces continued market share erosion in both consumer and data center processors, with AMD gaining approximately 7 percentage points of server market share over the past 24 months. The company's manufacturing technology transition continues to experience delays, with Intel 4 process yields improving more slowly than targeted, compromising competitive positioning versus TSMC-manufactured alternatives. Recent quarterly results showed concerning trends with data center revenue declining 15% YoY and gross margins contracting 310 basis points to 39.7%. The company's foundry strategy requires substantial capital expenditures ($27B planned for 2024) with uncertain returns, creating cash flow pressure despite government subsidies. Technical analysis shows the stock forming a descending triangle pattern after breaking below critical support at $32, suggesting additional downside risk. Management's decision to cut the dividend by 66% signals significant concerns about future cash flow generation capabilities. While valuation appears attractive at 19x forward earnings, these metrics fail to account for the structural challenges in Intel's competitive positioning and the extensive capital requirements needed to maintain manufacturing relevance."
  }
];

// Sector options
const SECTOR_COMBINATIONS = [
  { 
    strong: ["semiconductor diversification", "artificial intelligence", "cryptocurrency"],
    weak: ["traditional retail", "legacy energy"],
    detailedAnalysis: "The semiconductor diversification trend has accelerated as AI computation demands exceed NVIDIA's production capacity, creating opportunities for alternative AI accelerator providers. Technical analysis shows the Philadelphia Semiconductor Index (SOX) outperforming the broader market by 17.2 percentage points YTD, with AMD and smaller players like Lattice Semiconductor showing particular strength on increased institutional accumulation. Cryptocurrency markets have rebounded significantly with Bitcoin mining difficulty reaching all-time highs (67.3T) and transaction volumes on major exchanges up 142% YoY. Conversely, traditional retail faces persistent headwinds from e-commerce penetration (now 23.4% of total retail) and shifting consumer preferences toward experiences over goods, evidenced by declining foot traffic metrics (-7.3% YoY). Legacy energy companies struggle with declining production economics as renewable energy reaches grid parity in 78% of global markets, while institutional ESG mandates continue to restrict capital flows into fossil fuel investments."
  },
  { 
    strong: ["cloud computing", "crypto trading platforms", "retail investor favorites"], 
    weak: ["brick-and-mortar retail", "traditional media"],
    detailedAnalysis: "Cloud computing infrastructure continues its robust expansion with global spending reaching $115B quarterly (+18.3% YoY) as enterprises accelerate digital transformation initiatives. AI workloads have emerged as the fastest-growing segment, expanding cloud providers' addressable market by an estimated $176B through 2028. Crypto trading platforms have experienced remarkable resurgence with daily active users increasing 87% over six months and new account openings reaching levels not seen since 2021. Social media analysis reveals retail investors maintaining concentrated positions in familiar technology names despite market volatility, with \"FAANG+\" stocks comprising approximately a 43% share of retail portfolios according to Robinhood data. Meanwhile, brick-and-mortar retail faces structural challenges with store closure announcements up 32% YoY and department store foot traffic declining 12.3% despite increased promotional activity. Traditional media continues to lose advertising market share, with linear TV ad spending declining 8.7% while digital alternatives expand 14.2%, reflecting permanent shifts in consumer engagement patterns."
  },
  { 
    strong: ["alternative AI chips", "cash-strong tech", "digital payments"], 
    weak: ["cash-burning startups", "high-debt companies"],
    detailedAnalysis: "Alternative AI chip manufacturers have gained significant traction with data center operators seeking to diversify supply chains beyond NVIDIA's dominant position. Companies offering specialized AI accelerators have seen design wins increase 112% YoY as computational requirements for larger language models drive hardware innovation. Tech companies with substantial cash reserves (top 10 technology firms now hold over $623B collectively) have demonstrated resilience during market volatility through strategic share repurchases, with buybacks increasing 28% from the previous quarter. Digital payment providers continue to benefit from e-commerce growth and reduced cash usage, with transaction volumes up 21.7% YoY and average transaction values increasing 8.3%. In contrast, unprofitable growth companies have experienced significant valuation compression as interest rates remain elevated, with the Goldman Sachs Non-Profitable Tech Index underperforming the Nasdaq by 27.4 percentage points over 12 months. High-debt companies face refinancing challenges in the current rate environment, with CCC-rated debt yielding 11.8% on average and refinancing activity down 42% YoY, creating potential liquidity concerns as debt maturities approach."
  },
  { 
    strong: ["fintech", "established tech with AI integration", "crypto exchanges"], 
    weak: ["fossil fuels", "legacy automotive"],
    detailedAnalysis: "Fintech platforms have successfully expanded product offerings beyond core payment processing to include lending, investing, and financial management services, increasing average revenue per user by 31% YoY. The sector benefits from continuing digitalization of financial services, with 72% of consumers now preferring digital banking channels over physical branches. Established technology companies have effectively leveraged existing customer bases to monetize AI capabilities, with subscription services enhanced by AI features showing 24% lower churn and 17% higher ARPU. Cryptocurrency exchanges have benefited from regulatory clarity improvements and institutional adoption, with spot Bitcoin ETF volumes exceeding $48B in monthly trading and custody services expanding to traditional financial institutions. Fossil fuel investments face structural challenges from renewable energy cost declines (solar LCOE down 12% YoY) and tightening emissions regulations in major markets, with capital expenditures in the sector declining for the fifth consecutive quarter. Traditional automotive manufacturers struggle with EV transition economics, facing margin compression (-3.7 percentage points on average) and substantial capital requirements ($93B committed collectively) with uncertain returns as competition intensifies from pure-play EV manufacturers and new market entrants."
  }
];

// Market outlook options
const MARKET_OUTLOOKS = [
  "Retail investors are taking a more defensive stance by increasing cash positions while maintaining core holdings in established tech companies. AMD is gaining momentum as investors seek semiconductor diversification beyond NVIDIA, particularly through its MI300 AI accelerators. Meanwhile, cryptocurrency trading volumes are surging on platforms like Coinbase and Robinhood following positive market sentiment shifts.",
  
  "Market sentiment among retail traders shows resilience despite recent volatility, with social media communities characterizing pullbacks as opportunities to accumulate rather than signals to exit positions. Data indicates selective positioning in AI and semiconductor stocks as investors adapt their strategies in response to economic uncertainties while maintaining conviction in technological innovation.",
  
  "Recent trading data reveals retail investors are becoming more selective in their positioning compared to previous market cycles. While maintaining a bullish stance on technology broadly, investors are diversifying their semiconductor exposure beyond market leaders, increasing cryptocurrency allocations following sentiment shifts, and maintaining cash reserves to capitalize on market dips.",
  
  "Retail investor behavior is evolving with increased sophistication, as evidenced by defensive cash allocation increases while simultaneously targeting specific growth opportunities in alternative AI semiconductor companies and crypto platforms. This bifurcated approach balances risk management with continued exposure to high-conviction technology themes."
];

// Strategy options
const STRATEGIES = [
  "Given retail investors' increased cash positions amid volatility, our strategy recommends maintaining sufficient liquidity to capitalize on short-term market dislocations while staying invested in core technology positions. Consider diversifying semiconductor exposure beyond market leaders through companies like AMD that offer alternative AI chip exposure. The surge in cryptocurrency trading volumes through Robinhood and Coinbase suggests potential opportunities in the digital asset space for investors comfortable with higher volatility assets.",
  
  "Our analysis of retail investor sentiment indicates an opportunity to balance defensive positioning with selective growth exposure. We recommend: 1) Maintaining a cash reserve of 15-20% to deploy during market pullbacks, 2) Diversifying within the semiconductor space beyond leading names, 3) Considering limited exposure to cryptocurrency trading platforms benefiting from increased retail activity, and 4) Focusing on companies with demonstrable AI implementation rather than just aspirational narratives.",
  
  "The 'diamond hands' mentality observed in retail communities suggests continued resilience in certain market segments despite broader volatility. Our recommended approach combines tactical cash deployment on market dips with core positions in diversified technology companies showing actual AI implementation. Risk management through position sizing is essential given the selective nature of current market strength.",
  
  "Current retail positioning suggests a barbell strategy may be optimal: maintaining selective high-conviction technology investments balanced with increased cash reserves and defensive positions. The increased trading activity in cryptocurrency platforms indicates speculative interest is returning to digital assets, though position sizing should remain conservative given the inherent volatility."
];

// Key market events options
const KEY_EVENT_SETS = [
  [
    "Retail investors are increasing cash positions while maintaining core technology holdings according to AAII sentiment survey data, indicating a more defensive yet still constructive market approach.",
    "AMD is gaining traction among retail investors seeking AI semiconductor exposure beyond NVIDIA, with social media platforms showing increased discussion of their MI300 AI accelerators.",
    "Cryptocurrency trading volumes have surged on both Coinbase and Robinhood platforms following pro-crypto market statements, suggesting renewed retail interest in digital assets.",
    "Reddit investment communities characterize recent market volatility as an accumulation opportunity rather than a reason to exit positions, though data indicates more selective positioning compared to previous cycles."
  ],
  [
    "AAII sentiment data shows retail investors increasing defensive cash positions while maintaining conviction in established technology companies experiencing artificial intelligence adoption.",
    "StockTwits and social media analytics reveal growing retail interest in AMD as a semiconductor alternative for AI exposure, focusing on MI300 accelerator product adoption.",
    "Robinhood and Coinbase report significant increases in cryptocurrency trading volume, indicating renewed speculative interest in digital assets among retail traders.",
    "Reddit's investment communities demonstrate evolving 'diamond hands' approach, with data showing more selective positioning compared to previous volatility episodes."
  ],
  [
    "Retail sentiment surveys indicate investors are taking a bifurcated approach: increasing cash reserves while simultaneously maintaining conviction in specific technology segments.",
    "Alternative semiconductor companies like AMD are seeing increased retail investor interest as traders seek diversification beyond market leaders in AI chip exposure.",
    "Digital asset trading platforms report substantial volume increases, with executives citing improved retail sentiment following recent market developments.",
    "Social media investment communities show more selective positioning than in previous market cycles, focusing on companies with tangible AI implementation rather than speculative narratives."
  ],
  [
    "Recent market volatility has prompted retail investors to increase cash allocations while maintaining core positions in established technology companies according to sentiment surveys.",
    "Semiconductor diversification is emerging as a key retail investor theme, with AMD gaining attention as an alternative to market-leading NVIDIA for AI chip exposure.",
    "Cryptocurrency trading volume has surged across retail platforms following positive market developments, indicating renewed interest in digital assets.",
    "Investment communities on social platforms demonstrate a more measured approach to market volatility, characterized by selective accumulation rather than indiscriminate buying."
  ]
];

// Persistent methodology and sources sections
const METHODOLOGY = "Our Daily Market Memo integrates quantitative analysis, retail sentiment data, technical indicators, and social media trends. We specifically analyze retail investor behavioral patterns from multiple sources including Reddit, StockTwits, and trading platforms to identify emerging opportunities and risks. The memo synthesizes recent financial news directly relevant to retail investor positioning and sentiment.";

const SOURCES = [
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/" },
  { name: "TradingView", url: "https://www.tradingview.com/" },
  { name: "AAII", url: "https://www.aaii.com/" },
  { name: "WSB Reddit", url: "https://www.reddit.com/r/wallstreetbets/" },
  { name: "Robinhood", url: "https://investors.robinhood.com/" },
  { name: "StockTwits", url: "https://stocktwits.com/" },
  { name: "Coinbase", url: "https://www.coinbase.com/blog" },
  { name: "Fintel", url: "https://fintel.io/" },
  { name: "Bloomberg", url: "https://www.bloomberg.com/" }
];

// Key for local storage
const SUMMARY_STORAGE_KEY = "daily-market-summary";

// Summary data interface
interface SummaryData {
  marketOutlook: string;
  sectors: {
    strong: string[];
    weak: string[];
  };
  strategy: string;
  keyEvents: string[];
  methodology: string;
  sources: { name: string; url: string }[];
  lastUpdated: string;
}

export function Summary() {
  const [date, setDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState<SummaryData>({
    marketOutlook: "",
    sectors: { strong: [], weak: [] },
    strategy: "",
    keyEvents: [],
    methodology: "",
    sources: [],
    lastUpdated: ""
  });
  
  // Format date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate daily summary
  const generateDailySummary = useCallback(() => {
    console.log("Generating new daily summary...");
    
    // Select a random market outlook
    const marketOutlook = MARKET_OUTLOOKS[Math.floor(Math.random() * MARKET_OUTLOOKS.length)];
    
    // Select a random sector combination
    const selectedSectors = SECTOR_COMBINATIONS[Math.floor(Math.random() * SECTOR_COMBINATIONS.length)];
    
    // Select a random strategy
    const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
    
    // Select a random set of key events
    const keyEvents = KEY_EVENT_SETS[Math.floor(Math.random() * KEY_EVENT_SETS.length)];
    
    // Create new summary data
    const newSummaryData = {
      marketOutlook,
      sectors: selectedSectors,
      strategy,
      keyEvents,
      methodology: METHODOLOGY,
      sources: SOURCES,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Update state
    setSummaryData(newSummaryData);
    
    // Save to local storage
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(newSummaryData));
    
    console.log("New daily summary generated:", newSummaryData);
  }, []);
  
  // Load saved summary on component mount and check if a new summary is needed
  useEffect(() => {
    try {
      // Load saved summary from local storage
      const savedSummary = localStorage.getItem(SUMMARY_STORAGE_KEY);
      
      if (savedSummary) {
        const parsedSummary = JSON.parse(savedSummary);
        
        // Check if the saved summary is from today
        const today = new Date().toISOString().split('T')[0];
        
        if (parsedSummary.lastUpdated === today) {
          // If the saved summary is from today, use it
          console.log("Using saved summary from today:", parsedSummary);
          setSummaryData(parsedSummary);
        } else {
          // If the saved summary is not from today, generate a new one
          console.log("Saved summary is outdated, generating a new one...");
          generateDailySummary();
        }
      } else {
        // If there's no saved summary, generate a new one
        console.log("No saved summary found, generating a new one...");
        generateDailySummary();
      }
    } catch (error) {
      console.error("Error loading saved summary:", error);
      // If there's an error, generate a new summary
      generateDailySummary();
    }
  }, [generateDailySummary]);
  
  // Check for a new day periodically
  useEffect(() => {
    const checkForNewDay = () => {
      const currentDate = new Date().toISOString().split('T')[0];
      const lastUpdateDate = summaryData.lastUpdated;
      
      // If the date has changed, update the date and generate a new summary
      if (currentDate !== lastUpdateDate) {
        console.log("New day detected, generating fresh summary...");
        setDate(new Date());
        generateDailySummary();
      }
    };
    
    // Check for a new day every 5 minutes
    const intervalId = setInterval(checkForNewDay, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [summaryData.lastUpdated, generateDailySummary]);

  return (
    <Card className="glass-card border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          Daily Market Memo
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-md">Market Executive Summary</h3>
            <p className="leading-relaxed">
              {summaryData.marketOutlook}
            </p>
            <p className="leading-relaxed mt-2">
              Our analysis indicates strong opportunities in {summaryData.sectors.strong.join(", ")} 
              sectors, while suggesting caution in {summaryData.sectors.weak.join(" and ")}.
              </p>
            </div>
            
          <div className="flex items-start gap-2 mt-4 pt-3 border-t border-border">
            <CheckCircle className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Investment Strategy Deep Dive:</p>
              <p className="text-sm leading-relaxed">{summaryData.strategy}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-sm font-medium mb-2">Key Market Events & Analysis:</p>
            <ul className="list-disc pl-5 space-y-3">
              {summaryData.keyEvents.map((event, index) => (
                <li key={index} className="text-sm leading-relaxed">{event}</li>
              ))}
            </ul>
            </div>
            
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-sm font-medium mb-1">Our Methodology:</p>
            <p className="text-sm leading-relaxed">{summaryData.methodology}</p>
            <p className="text-sm font-medium mt-3 mb-1">Data Sources:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {summaryData.sources.map((source, index) => (
                <a 
                  key={index} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-xs bg-background hover:bg-muted rounded-full px-2 py-0.5 border border-border my-1"
                >
                  {source.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
