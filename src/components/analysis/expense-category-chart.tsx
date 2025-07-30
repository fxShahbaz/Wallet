
"use client"
import * as React from "react"
import { useMemo } from "react"
import { Pie, PieChart } from "recharts"
import { Transaction } from "@/lib/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

export function ExpenseCategoryChart({ transactions }: { transactions: Transaction[] }) {
  const chartData = useMemo(() => {
    const expenseByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0, fill: `hsl(var(--chart-${Object.keys(acc).length % 5 + 1}))` };
        }
        acc[t.category].value += t.amount;
        return acc;
      }, {} as Record<string, { name: string, value: number, fill: string }>);
    
    return Object.values(expenseByCategory);
  }, [transactions]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, data) => {
        acc[data.name] = {
            label: data.name,
            color: data.fill,
        };
        return acc;
    }, {} as any)
  }, [chartData])

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
        <CardDescription className="text-xs">Spending by category for all time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
         <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-1">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center text-xs">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.fill }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
