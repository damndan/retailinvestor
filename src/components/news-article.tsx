
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface NewsArticleProps {
  article: {
    id: string;
    title: string;
    summary: string;
    source: string;
    url: string;
    publishedAt: string;
    category: string;
    sentiment: "positive" | "negative" | "neutral";
  };
}

export function NewsArticle({ article }: NewsArticleProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500 hover:bg-green-600";
      case "negative":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  // Format the published date as a relative time (e.g., "2 hours ago")
  const publishedTimeAgo = formatDistanceToNow(
    new Date(article.publishedAt), 
    { addSuffix: true }
  );

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{article.title}</CardTitle>
            <CardDescription className="text-sm mt-1 flex items-center gap-2">
              <span>{article.source}</span>
              <span>•</span>
              <span>{publishedTimeAgo}</span>
            </CardDescription>
          </div>
          <Badge 
            className={`${getSentimentColor(article.sentiment)} text-white`}
          >
            {article.sentiment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{article.summary}</p>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </CardContent>
    </Card>
  );
}
