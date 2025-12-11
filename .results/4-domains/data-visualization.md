# Data Visualization Domain

## Overview

Data visualization uses **Recharts** library for dashboard analytics. Charts are client-side only and must be wrapped in ResponsiveContainer.

## Required Patterns

### 1. Client Component Requirement

Charts must be in client components:

```tsx
// components/dashboard-charts.tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
```

Pattern: Always mark chart components with "use client" directive.

### 2. ResponsiveContainer Wrapper

Wrap charts in ResponsiveContainer:

```tsx
<ResponsiveContainer width="100%" height={350}>
  <BarChart data={data}>
    {/* Chart components */}
  </BarChart>
</ResponsiveContainer>
```

Pattern: Set width="100%" and specific height value.

### 3. Chart Data Format

Charts expect array of objects with keys:

```typescript
interface TaskStats {
  month: string
  total: number
  completed: number
}

const chartData: TaskStats[] = [
  { month: "Jan", total: 12, completed: 8 },
  { month: "Feb", total: 15, completed: 11 },
  { month: "Mar", total: 18, completed: 14 },
]
```

Pattern: Each object represents one data point, keys map to chart axes/bars.

### 4. Axis Configuration

Configure XAxis and YAxis:

```tsx
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
```

Pattern:
- `dataKey`: Data key for axis values
- `stroke`: Axis color
- `tickLine={false}`, `axisLine={false}`: Remove lines
- `tickFormatter`: Format tick labels

### 5. Tooltip Customization

Customize tooltip appearance:

```tsx
<Tooltip
  cursor={{ fill: "transparent" }}
  contentStyle={{
    backgroundColor: "#072427",
    borderColor: "hsl(var(--border))",
  }}
/>
```

Pattern: Use CSS custom properties for colors to match theme.

### 6. Bar Configuration

Configure Bar components:

```tsx
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
```

Pattern:
- `dataKey`: Data object key to visualize
- `name`: Legend label
- `fill`: Bar color
- `radius`: Rounded corners [topLeft, topRight, bottomRight, bottomLeft]

## Complete Chart Example

```tsx
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

## Recharts Components Used

### BarChart

```tsx
import { BarChart } from "recharts"

<BarChart data={data}>
  <XAxis dataKey="month" />
  <YAxis />
  <Bar dataKey="total" fill="#F5532C" />
</BarChart>
```

### Bar

```tsx
import { Bar } from "recharts"

<Bar
  dataKey="completed"
  name="Completed Tasks"
  fill="#00848B"
  radius={[4, 4, 0, 0]}
/>
```

### XAxis / YAxis

```tsx
import { XAxis, YAxis } from "recharts"

<XAxis
  dataKey="category"
  stroke="#888888"
  fontSize={12}
  tickLine={false}
  axisLine={false}
/>
```

### Tooltip

```tsx
import { Tooltip } from "recharts"

<Tooltip
  cursor={{ fill: "transparent" }}
  contentStyle={{
    backgroundColor: "#072427",
    borderColor: "hsl(var(--border))",
  }}
/>
```

### Legend

```tsx
import { Legend } from "recharts"

<Legend wrapperStyle={{ fontSize: "14px" }} />
```

### ResponsiveContainer

```tsx
import { ResponsiveContainer } from "recharts"

<ResponsiveContainer width="100%" height={350}>
  <BarChart data={data}>
    {/* Chart components */}
  </BarChart>
</ResponsiveContainer>
```

## Usage in Dashboard

```tsx
// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  // Generate chart data
  const chartData = [
    { month: "Jan", total: 12, completed: 8 },
    { month: "Feb", total: 15, completed: 11 },
    { month: "Mar", total: 18, completed: 14 },
    { month: "Apr", total: 22, completed: 18 },
    { month: "May", total: 20, completed: 16 },
    { month: "Jun", total: 25, completed: 20 },
  ]
  
  return (
    <div className="p-8 space-y-8">
      <DashboardCharts data={chartData} />
    </div>
  )
}
```

## Chart Styling

### Colors

Use brand colors for consistency:
- Primary: `#F5532C` (orange/red)
- Secondary: `#00848B` (teal)
- Muted: `#888888` (gray)

### Typography

- Axis labels: `fontSize={12}`
- Legend: `fontSize: "14px"`

### Spacing

Wrap in Card component with proper padding:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Chart Title</CardTitle>
  </CardHeader>
  <CardContent className="pl-2">
    <ResponsiveContainer>
      {/* Chart */}
    </ResponsiveContainer>
  </CardContent>
</Card>
```

## Constraints

1. **Client component required**: Charts must use "use client"
2. **ResponsiveContainer required**: Always wrap charts
3. **No SSR**: Charts don't support server-side rendering
4. **Chart component location**: Chart components in components/ directory
5. **Data format**: Array of objects with consistent keys
6. **Width 100%**: Always use width="100%" for responsive
7. **Specific height**: Set specific height value (e.g., 350)
8. **Theme colors**: Use CSS custom properties for theme consistency

## Available Chart Types

While only BarChart is currently used, Recharts supports:
- BarChart
- LineChart
- AreaChart
- PieChart
- RadarChart
- ScatterChart
- ComposedChart

## Tools and Technologies

- **Recharts 2.14.1**: Chart library
- **ResponsiveContainer**: Responsive chart wrapper
- **React**: Client component requirement
