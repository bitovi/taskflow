import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, ListTodo, Award } from "lucide-react"
import { getTeamStats } from "@/app/(dashboard)/tasks/actions"

export async function TeamStats() {
  const { totalMembers, openTasks, tasksCompleted, topPerformer, error } = await getTeamStats()

  if (error) {
    console.error("Error fetching team stats:", error)
    // Return a fallback UI or empty stats
  }

  const stats = [
    {
      title: "Total Members",
      value: totalMembers || 0,
      icon: Users,
      color: "text-muted-foreground",
    },
    {
      title: "Open Tasks",
      value: openTasks || 0,
      icon: ListTodo,
      color: "text-muted-foreground",
    },
    {
      title: "Tasks Completed",
      value: tasksCompleted || 0,
      icon: CheckCircle,
      color: "text-muted-foreground",
    },
    {
      title: "Top Performer",
      value: topPerformer?.name || "N/A",
      description: `${topPerformer?.completedCount || 0} tasks completed`,
      icon: Award,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
