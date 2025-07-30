"use client"

import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

export function IncomeExpenseBarChart({ data }: { data: Transaction[] }) {
  const chartData = useMemo(() => {
    const groupedByDay = data.reduce((acc, transaction) => {
      const day = format(transaction.date, "MMM d");
      if (!acc[day]) {
        acc[day] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[day].income += transaction.amount;
      } else {
        acc[day].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number, expense: number }>);
    
    return Object.entries(groupedByDay)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date + ", " + new Date().getFullYear()).getTime() - new Date(b.date + ", " + new Date().getFullYear()).getTime());
  }, [data]);
  
  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
        <CardDescription>Comparison of income and expenses over the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No transaction data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
