"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, List, Clock } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts";
import { TaskOverview } from "@/components/task-overview";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllTasks } from "@/app/(dashboard)/tasks/actions";
import { useEffect, useState } from "react";
import { Prisma } from "@/app/generated/prisma";

import { poppins } from "@/lib/fonts";
// import { DashboardCharts } from "../../components/dashboard-charts";
// import { TaskOverview } from "../../components/task-overview";

// Use the Task type from Prisma
type Task = Prisma.TaskGetPayload<{
  include: {
    assignee: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export default function IndexPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    getAllTasks().then(({ tasks }) => {
      setAllTasks(tasks);
    });
  }, []);

  // Derive data client-side from allTasks
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((task) => task.status === "done").length;
  const openTasks = allTasks.filter((task) => task.status === "in_progress").length;
  const totalUsers = new Set(
    allTasks.flatMap((task) => [task.assignee?.id, task.creator?.id].filter(Boolean))
  ).size;
  const recentTasks = allTasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Group tasks by month (YYYY-MM)
  const statsMap = new Map();
  for (const task of allTasks) {
    const createdMonth = task.createdAt.toISOString().slice(0, 7); // 'YYYY-MM'
    if (!statsMap.has(createdMonth)) {
      statsMap.set(createdMonth, { month: createdMonth, total: 0, completed: 0 });
    }
    statsMap.get(createdMonth).total++;
    if (task.status === "done") {
      statsMap.get(createdMonth).completed++;
    }
  }
  // Convert to sorted array
  const taskStats = Array.from(statsMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  // Process data for charts
  const statusData = allTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = allTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assigneeData = allTasks.reduce((acc, task) => {
    const assigneeName = task.assignee?.name || 'Unassigned';
    acc[assigneeName] = (acc[assigneeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const creatorData = allTasks.reduce((acc, task) => {
    const creatorName = task.creator?.name || 'Unknown';
    acc[creatorName] = (acc[creatorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart-friendly format
  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    name: priority,
    count: count,
  }));

  const assigneeChartData = Object.entries(assigneeData).map(([assignee, count]) => ({
    name: assignee.length > 15 ? assignee.substring(0, 15) + '...' : assignee,
    tasks: count,
  }));

  const creatorChartData = Object.entries(creatorData).map(([creator, count]) => ({
    name: creator.length > 15 ? creator.substring(0, 15) + '...' : creator,
    created: count,
  }));

  // Colors for pie chart
  const COLORS = ['#BCECEF', '#4BBEC5', '#00848B', '#F5532C', '#8dd1e1', '#d084d0'];



  return (
    <div className="p-8">
      <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <List className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks ?? 0}</div>
            <p className="text-xs text-foreground-muted">All tasks in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks ?? 0}</div>
            <p className="text-xs text-foreground-muted">
              {totalTasks ? `${Math.round((completedTasks! / totalTasks!) * 100)}% completed` : "0% completed"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks}</div>
            <p className="text-xs text-foreground-muted">Tasks currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers ?? 0}</div>
            <p className="text-xs text-foreground-muted">Active users on the platform</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DashboardCharts data={taskStats} />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <TaskOverview tasks={recentTasks} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Task Status Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#F5532C"
                  dataKey="value"
                  fontSize={16}
                  label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: "transparent" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle >Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={20} />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="count" fill="#4BBEC5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasks by Assignee - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assigneeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={16} stroke="#888888" />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="tasks" fill="#4BBEC5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasks Created by User - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks Created by User</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={creatorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={16} />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="created" fill="#F5532C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
