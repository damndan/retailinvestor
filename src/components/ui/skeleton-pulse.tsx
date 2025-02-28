
import { cn } from "@/lib/utils";

interface SkeletonPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonPulse = ({ className, ...props }: SkeletonPulseProps) => {
  return (
    <div
      className={cn(
        "animate-pulse-subtle bg-muted/50 rounded-md",
        className
      )}
      {...props}
    />
  );
};

export { SkeletonPulse };
