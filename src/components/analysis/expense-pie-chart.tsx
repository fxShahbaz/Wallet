"use client"
import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"

export function ExpensePieChart({ data }: { data: Transaction[] }) {
  const chartData = useMemo(() => {
    const expenseData = data.filter((t) => t.type === 'expense');
    const groupedData = expenseData.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, amount], index) => ({
        category,
        amount,
        fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach(item => {
      const key = item.category.replace(/\s+/g, '-');
      config[key] = { label: item.category, color: item.fill };
    });
    return config;
  }, [chartData]);
  
  const pieChartData = useMemo(() => {
    return chartData.map(item => ({...item, name: item.category.replace(/\s+/g, '-')}))
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>A breakdown of your spending in the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={pieChartData} dataKey="amount" nameKey="name" innerRadius={60} strokeWidth={5} />
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
