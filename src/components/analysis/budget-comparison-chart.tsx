
"use client"
import * as React from "react"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Transaction, Category } from "@/lib/types"
import { startOfMonth, endOfMonth } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function BudgetComparisonChart({ transactions, categories }: { transactions: Transaction[], categories: Category[] }) {
  const chartData = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const monthlyExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.date >= start && t.date <= end
    );

    const spentByCategory = monthlyExpenses.reduce((acc, t) => {
        if (!acc[t.category]) {
            acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
    }, {} as Record<string, number>);

    return categories
        .filter(c => c.budget && c.budget > 0)
        .map(c => ({
            name: c.label,
            budget: c.budget,
            spent: spentByCategory[c.label] || 0,
        }));

  }, [transactions, categories]);
  
  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Budget vs. Spent (This Month)</CardTitle>
        <CardDescription className="text-xs">Comparison of your spending against your budget for each category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart 
            accessibilityLayer 
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
              right: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-xs"
              width={80}
            />
            <XAxis dataKey="budget" type="number" hide />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} barSize={12} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} barSize={12} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
