import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    citations?: { name: string; url: string }[];
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
            <CardTitle className="text-lg">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
              >
                {article.title}
              </a>
            </CardTitle>
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
        
        <div className="flex flex-col gap-2">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more <ExternalLink className="h-3 w-3 ml-1" />
          </a>
          
          {article.citations && article.citations.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <LinkIcon className="h-3 w-3" />
                <span>Sources:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {article.citations.map((citation, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={citation.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-xs bg-background hover:bg-muted rounded-full px-2 py-0.5 border border-border"
                        >
                          {citation.name}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">View source at {citation.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
