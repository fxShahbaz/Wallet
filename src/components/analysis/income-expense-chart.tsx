
"use client"
import * as React from "react"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Transaction } from "@/lib/types"
import { subDays, subMonths, subYears, format, startOfWeek, startOfMonth, startOfYear } from "date-fns"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

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

type TimeRange = "weekly" | "monthly" | "yearly";

export function IncomeExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");

  const { chartData, description } = useMemo(() => {
    const now = new Date();
    let data: { date: string, income: number, expense: number }[] = [];
    let desc = "";

    if (timeRange === 'weekly') {
      desc = "Income vs. Expense for the last 7 days";
      const weekStart = startOfWeek(now);
      data = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        return {
          date: format(date, "EEE"),
          income: 0,
          expense: 0,
        }
      });
      transactions.forEach(t => {
        const dayIndex = data.findIndex(d => d.date === format(t.date, "EEE"));
        if (dayIndex !== -1 && t.date >= subDays(now, 6)) {
          if (t.type === 'income') data[dayIndex].income += t.amount;
          else if (t.type === 'expense') data[dayIndex].expense += t.amount;
        }
      });
    } else if (timeRange === 'monthly') {
        desc = "Income vs. Expense for the last 12 months";
        data = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(now, 11 - i);
            return {
                date: format(date, "MMM"),
                income: 0,
                expense: 0,
            };
        });
        transactions.forEach(t => {
            if (t.date >= subMonths(now, 11)) {
                const monthIndex = data.findIndex(d => d.date === format(t.date, "MMM"));
                if (monthIndex !== -1) {
                    if (t.type === 'income') data[monthIndex].income += t.amount;
                    else if (t.type === 'expense') data[monthIndex].expense += t.amount;
                }
            }
        });
    } else if (timeRange === 'yearly') {
        desc = "Income vs. Expense for the last 5 years";
        const currentYear = now.getFullYear();
        data = Array.from({ length: 5 }, (_, i) => ({
            date: (currentYear - 4 + i).toString(),
            income: 0,
            expense: 0,
        }));
        transactions.forEach(t => {
            if (t.date >= subYears(now, 4)) {
                const yearIndex = data.findIndex(d => d.date === format(t.date, "yyyy"));
                if (yearIndex !== -1) {
                    if (t.type === 'income') data[yearIndex].income += t.amount;
                    else if (t.type === 'expense') data[yearIndex].expense += t.amount;
                }
            }
        });
    }
    return { chartData: data, description: desc };
  }, [transactions, timeRange]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="text-base font-semibold">Overview</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="weekly" className="text-xs">Weekly</SelectItem>
                <SelectItem value="monthly" className="text-xs">Monthly</SelectItem>
                <SelectItem value="yearly" className="text-xs">Yearly</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
