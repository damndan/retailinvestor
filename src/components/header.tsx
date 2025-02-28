
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { BarChart2 } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("px-6 py-4 border-b", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
          <div>
            <h1 className="text-lg font-medium">Daily Stock Sage</h1>
            <p className="text-xs text-muted-foreground">Intelligent stock insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
