import { AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCredits } from '@/contexts/CreditContext';
import { useCountdown } from '@/hooks/useCountdown';

export const LowCreditWarning = () => {
  const { credits } = useCredits();
  const { formatCountdown } = useCountdown();

  if (credits.remaining === 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <Clock className="h-4 w-4" />
        <AlertTitle>Daily Limit Reached</AlertTitle>
        <AlertDescription>
          You've used all {credits.total} credits today. Credits reset at midnight IST in {formatCountdown()}.
        </AlertDescription>
      </Alert>
    );
  }

  if (credits.remaining < 3) {
    return (
      <Alert className="mb-4 border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertTitle className="text-warning">Low Credits</AlertTitle>
        <AlertDescription className="text-warning-foreground">
          Only {credits.remaining} credits remaining. Credits reset at midnight.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
