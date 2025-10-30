import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_COLORS } from '@/utils/constants';

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: any[] | null;
  loading: boolean;
}

export const CategoryPieChart = ({ data, loading }: CategoryPieChartProps) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item: any) => {
      const [name, value] = Object.entries(item)[0];
      return { name, value: Number(value) };
    });
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No category data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Bid participation by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} bids`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
