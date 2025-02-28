
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { NewsArticle, fetchNewsArticles } from "@/services/news-service";
import { NewsArticleCard } from "./news-article-card";

export function NewsSection() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch news when component mounts or when a new day begins
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const articles = await fetchNewsArticles();
        setNewsArticles(articles);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    // Check for news updates every 30 minutes
    const intervalId = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="glass-card border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          Today's Market News
          {isLoading && <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>}
        </CardTitle>
        <CardDescription>
          Latest news for retail investors
          <span className="text-xs ml-2 text-muted-foreground">
            (Last updated: {lastUpdated.toLocaleTimeString()})
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="border animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))
          ) : newsArticles.length > 0 ? (
            // Display news articles
            newsArticles.map(article => (
              <NewsArticleCard key={article.id} article={article} />
            ))
          ) : (
            // No news message
            <div className="text-center py-8 text-muted-foreground">
              No news articles available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
