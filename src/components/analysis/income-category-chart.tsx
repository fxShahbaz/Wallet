
"use client"
import * as React from "react"
import { useMemo, useState } from "react"
import { Pie, PieChart } from "recharts"
import { Transaction } from "@/lib/types"
import { subDays, isAfter } from "date-fns"


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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

type TimeRange = "week" | "month" | "all";

export function IncomeCategoryChart({ transactions }: { transactions: Transaction[] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const { chartData, description } = useMemo(() => {
    const now = new Date();
    let filteredTransactions = transactions;
    let desc = "Income by category for all time";

    if (timeRange === 'week') {
        const sevenDaysAgo = subDays(now, 7);
        filteredTransactions = transactions.filter(t => isAfter(t.date, sevenDaysAgo));
        desc = "Income by category for the last 7 days";
    } else if (timeRange === 'month') {
        const thirtyDaysAgo = subDays(now, 30);
        filteredTransactions = transactions.filter(t => isAfter(t.date, thirtyDaysAgo));
        desc = "Income by category for the last 30 days";
    }

    const incomeByCategory = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0, fill: `hsl(var(--chart-${Object.keys(acc).length % 2 + 2}))` };
        }
        acc[t.category].value += t.amount;
        return acc;
      }, {} as Record<string, { name: string, value: number, fill: string }>);
    
    return { chartData: Object.values(incomeByCategory), description: desc };
  }, [transactions, timeRange]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, data) => {
        acc[data.name] = {
            label: data.name,
            color: data.fill,
        };
        return acc;
    }, {} as any)
  }, [chartData])

  if (transactions.filter(t => t.type === 'income').length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="text-base font-semibold">Income Breakdown</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="week" className="text-xs">Last 7 days</SelectItem>
                <SelectItem value="month" className="text-xs">Last 30 days</SelectItem>
                <SelectItem value="all" className="text-xs">All Time</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
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
        ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No income data for this period
            </div>
        )}
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
