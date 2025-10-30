import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/utils/formatters';
import type { StatePerformance } from '@/types/api.types';

interface StatePerformanceChartProps {
  data: StatePerformance[] | null;
  loading: boolean;
}

export const StatePerformanceChart = ({ data, loading }: StatePerformanceChartProps) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return [...data]
      .sort((a, b) => b.total_tenders - a.total_tenders)
      .slice(0, 15);
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing States</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex items-center justify-center text-muted-foreground">
            No state data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing States</CardTitle>
        <CardDescription>By total tender volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="state_name" width={110} />
            <Tooltip formatter={(value: number) => `${formatNumber(value)} tenders`} />
            <Bar dataKey="total_tenders" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index < 3 ? 'hsl(160, 100%, 40%)' : 'hsl(var(--primary))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
