
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/services/news-service";

interface NewsArticleCardProps {
  article: NewsArticle;
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  // Format the published date
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{article.source}</span>
              <span>•</span>
              <span>{formatPublishedDate(article.publishedAt)}</span>
            </CardDescription>
          </div>
          {article.imageUrl && (
            <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0 ml-2">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.summary}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {article.tickers?.slice(0, 3).map(ticker => (
              <Badge key={ticker} variant="outline" className="text-xs">
                ${ticker}
              </Badge>
            ))}
            {article.tickers && article.tickers.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tickers.length - 3} more
              </Badge>
            )}
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            Read more <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
