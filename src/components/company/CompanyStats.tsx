import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import type { BidsResponse } from '@/types/api.types';

interface CompanyStatsProps {
  data: BidsResponse | null;
}

export const CompanyStats = ({ data }: CompanyStatsProps) => {
  if (!data) return null;

  const { table1, count } = data;
  const winRate = count > 0 ? ((table1.win / count) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Total Bids',
      value: formatNumber(count),
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Wins',
      value: formatNumber(table1.win),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    {
      title: 'Total Value',
      value: formatCurrency(table1.totalBidValue),
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
