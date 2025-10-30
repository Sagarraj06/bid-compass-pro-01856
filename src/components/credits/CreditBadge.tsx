import { Coins } from 'lucide-react';
import { useCredits } from '@/contexts/CreditContext';
import { useCountdown } from '@/hooks/useCountdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export const CreditBadge = () => {
  const { credits } = useCredits();
  const { formatCountdown } = useCountdown();

  const getVariant = () => {
    if (credits.remaining === 0) return 'destructive';
    if (credits.remaining < 3) return 'secondary';
    return 'default';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer">
            <Coins className="h-4 w-4" />
            <span className="font-semibold">
              {credits.remaining}/{credits.total}
            </span>
            <span className="text-xs opacity-80">Credits</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">Daily Credits</p>
            <p className="text-muted-foreground">Used: {credits.used}</p>
            <p className="text-muted-foreground">Remaining: {credits.remaining}</p>
            <p className="text-muted-foreground mt-1">
              Resets in: {formatCountdown()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
