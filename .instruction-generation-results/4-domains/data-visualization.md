# Data Visualization Domain Implementation

## Recharts Integration

All data visualization uses the Recharts library with ResponsiveContainer for proper sizing:

```typescript
// components/dashboard-charts.tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskStats {
  month: string
  total: number
  completed: number
}

export function DashboardCharts({ data }: { data: TaskStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis 
              dataKey="month" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#072427",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar 
              dataKey="total" 
              name="Total Tasks" 
              fill="#F5532C" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="completed" 
              name="Completed" 
              fill="#00848B" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

## Data Processing for Charts

Chart data is processed on the server and passed to chart components:

```typescript
// app/(dashboard)/page.tsx
import { DashboardCharts } from "@/components/dashboard-charts"
import { getAllTasks } from "./tasks/actions"

async function getTaskStats() {
  const tasks = await getAllTasks()
  
  // Process tasks into chart data
  const monthlyStats = tasks.reduce((acc, task) => {
    const month = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { month, total: 0, completed: 0 }
    }
    acc[month].total++
    if (task.status === 'done') {
      acc[month].completed++
    }
    return acc
  }, {} as Record<string, TaskStats>)
  
  return Object.values(monthlyStats)
}

export default async function Dashboard() {
  const taskStats = await getTaskStats()
  
  return (
    <div className="space-y-6">
      <DashboardCharts data={taskStats} />
    </div>
  )
}
```

## Theming and Styling

Charts use consistent colors and styling that match the application theme:

```typescript
// Custom theme colors applied to charts
const chartColors = {
  primary: "#F5532C",    // Orange for primary data
  secondary: "#00848B",  // Teal for secondary data
  background: "#072427", // Dark background for tooltips
  text: "#888888",       // Muted text color
}

// Applied in chart configuration
<Bar dataKey="total" fill={chartColors.primary} />
<Bar dataKey="completed" fill={chartColors.secondary} />
<Tooltip
  contentStyle={{
    backgroundColor: chartColors.background,
    borderColor: "hsl(var(--border))",
  }}
/>
```

## Chart Component Pattern

Charts are separated into dedicated components that receive processed data:

```typescript
// Pattern for creating new chart components
interface ChartProps {
  data: DataType[]
  className?: string
}

export function CustomChart({ data, className }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Chart Title</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {/* Recharts component */}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

## Statistics Cards

Simple metrics are displayed using card components without charts:

```typescript
// components/team-stats.tsx
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function TeamStats({ users, tasks }: { users: User[], tasks: Task[] }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={users.length}
        description="Active team members"
      />
      <StatsCard
        title="Total Tasks"
        value={totalTasks}
        description="All tasks in system"
      />
      <StatsCard
        title="Completed"
        value={completedTasks}
        description="Finished tasks"
      />
      <StatsCard
        title="Completion Rate"
        value={`${completionRate}%`}
        description="Overall progress"
      />
    </div>
  )
}
```

This approach provides clean, responsive data visualization that integrates seamlessly with the application's design system.