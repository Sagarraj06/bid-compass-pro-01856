import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMonth, formatCurrency } from '@/utils/formatters';

interface MonthlyTrendChartProps {
  monthlyTotals: Record<string, number> | null;
  loading: boolean;
}

export const MonthlyTrendChart = ({ monthlyTotals, loading }: MonthlyTrendChartProps) => {
  const chartData = useMemo(() => {
    if (!monthlyTotals) return [];
    
    return Object.entries(monthlyTotals).map(([month, value]) => ({
      month: formatMonth(month),
      value: Number(value) || 0
    }));
  }, [monthlyTotals]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No monthly data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance Trend</CardTitle>
        <CardDescription>Bid value over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Bid Value"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
