import { Building2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import type { BidsResponse, PriceBandResponse } from '@/types/api.types';

interface CompanyProfileProps {
  companyName: string;
  bidsData: BidsResponse | null;
  priceBand: PriceBandResponse | null;
  onGenerateReport: () => void;
  creditsRemaining: number;
}

export const CompanyProfile = ({
  companyName,
  bidsData,
  priceBand,
  onGenerateReport,
  creditsRemaining
}: CompanyProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{companyName}</CardTitle>
              <CardDescription>Government Tender Participant</CardDescription>
            </div>
          </div>
          <Button
            onClick={onGenerateReport}
            disabled={creditsRemaining === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Generate Report (1 Credit)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bidsData && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Performance Metrics</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Total Bids: {bidsData.count}
                </Badge>
                <Badge variant="secondary">
                  Wins: {bidsData.table1.win}
                </Badge>
                <Badge variant="secondary">
                  Lost: {bidsData.table1.lost}
                </Badge>
                <Badge variant="secondary">
                  Win Rate: {((bidsData.table1.win / bidsData.count) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          )}

          {priceBand && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Price Band Analysis</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Lowest Bid</p>
                  <p className="text-sm font-semibold">{formatCurrency(priceBand.lowest)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Bid</p>
                  <p className="text-sm font-semibold">{formatCurrency(priceBand.average)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Highest Bid</p>
                  <p className="text-sm font-semibold">{formatCurrency(priceBand.highest)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
