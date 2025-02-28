
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronDown, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [date, setDate] = useState<Date>(new Date());

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
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{format(date, "MMM d, yyyy")}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
