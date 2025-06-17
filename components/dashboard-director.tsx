"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Building2,
  Bell,
  User,
  LogOut,
  Settings,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardDirector() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  // Sample director data
  const directorData = {
    totalRevenue: "$2.4M",
    revenueGrowth: "+12.5%",
    totalPatients: 15420,
    patientGrowth: "+8.3%",
    totalStaff: 245,
    staffGrowth: "+5.2%",
    operationalCosts: "$1.8M",
    costChange: "-3.1%",
  }

  // Sample revenue data
  const revenueData = [
    { month: "Jan", revenue: 180000, costs: 140000, profit: 40000 },
    { month: "Feb", revenue: 195000, costs: 145000, profit: 50000 },
    { month: "Mar", revenue: 210000, costs: 150000, profit: 60000 },
    { month: "Apr", revenue: 225000, costs: 155000, profit: 70000 },
    { month: "May", revenue: 240000, costs: 160000, profit: 80000 },
    { month: "Jun", revenue: 255000, costs: 165000, profit: 90000 },
  ]

  // Sample patient data
  const patientData = [
    { month: "Jan", outpatient: 1200, inpatient: 300, emergency: 450 },
    { month: "Feb", outpatient: 1350, inpatient: 320, emergency: 480 },
    { month: "Mar", outpatient: 1400, inpatient: 340, emergency: 520 },
    { month: "Apr", outpatient: 1500, inpatient: 360, emergency: 550 },
    { month: "May", outpatient: 1600, inpatient: 380, emergency: 580 },
    { month: "Jun", outpatient: 1700, inpatient: 400, emergency: 600 },
  ]

  // Sample department performance
  const departmentData = [
    { name: "Cardiology", value: 25, color: "#3FB6F6" },
    { name: "Emergency", value: 20, color: "#34D399" },
    { name: "Pediatrics", value: 18, color: "#F59E0B" },
    { name: "Orthopedics", value: 15, color: "#8B5CF6" },
    { name: "Neurology", value: 12, color: "#EF4444" },
    { name: "Others", value: 10, color: "#6B7280" },
  ]

  // Sample KPI data
  const kpiData = [
    {
      title: "Patient Satisfaction",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      description: "Average satisfaction score",
    },
    {
      title: "Bed Occupancy Rate",
      value: "87.5%",
      change: "+5.3%",
      trend: "up",
      description: "Current occupancy level",
    },
    {
      title: "Average Length of Stay",
      value: "3.2 days",
      change: "-0.5 days",
      trend: "down",
      description: "Patient stay duration",
    },
    {
      title: "Staff Turnover Rate",
      value: "8.1%",
      change: "-1.2%",
      trend: "down",
      description: "Annual turnover rate",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="mt-2 text-gray-600">Strategic overview and key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Executive Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Budget Alert</span>
                <span className="text-xs text-muted-foreground">Q4 budget utilization at 85%</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="font-medium">Performance Review</span>
                <span className="text-xs text-muted-foreground">Monthly KPI report ready</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Director Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-[#3FB6F6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-[#3FB6F6]">{directorData.totalRevenue}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{directorData.revenueGrowth}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-[#3FB6F6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#34D399]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-[#34D399]">{directorData.totalPatients.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{directorData.patientGrowth}</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-[#34D399]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{directorData.totalStaff}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{directorData.staffGrowth}</span>
                </div>
              </div>
              <Building2 className="h-8 w-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8B5CF6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Operational Costs</p>
                <p className="text-2xl font-bold text-[#8B5CF6]">{directorData.operationalCosts}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{directorData.costChange}</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  <span className="text-sm text-green-600">{kpi.change}</span>
                </div>
                <p className="text-xs text-gray-500">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
          <TabsTrigger value="departments">Department Performance</TabsTrigger>
          <TabsTrigger value="strategic">Strategic Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue vs Costs Analysis
                </CardTitle>
                <CardDescription>Monthly financial performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3FB6F6" name="Revenue" />
                    <Bar dataKey="costs" fill="#F59E0B" name="Costs" />
                    <Bar dataKey="profit" fill="#34D399" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Profit Trend Analysis
                </CardTitle>
                <CardDescription>Monthly profit growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Profit"]} />
                    <Line type="monotone" dataKey="profit" stroke="#34D399" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Key financial metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Average Monthly Revenue</p>
                  <p className="text-2xl font-bold text-[#3FB6F6]">$217K</p>
                  <p className="text-sm text-gray-600">12.5% increase from last period</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                  <p className="text-2xl font-bold text-[#34D399]">28.4%</p>
                  <p className="text-sm text-gray-600">Above industry average</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Cost Efficiency</p>
                  <p className="text-2xl font-bold text-[#F59E0B]">71.6%</p>
                  <p className="text-sm text-gray-600">Operational cost ratio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Patient Volume Analysis
              </CardTitle>
              <CardDescription>Monthly patient distribution by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={patientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="outpatient" stackId="a" fill="#3FB6F6" name="Outpatient" />
                  <Bar dataKey="inpatient" stackId="a" fill="#34D399" name="Inpatient" />
                  <Bar dataKey="emergency" stackId="a" fill="#F59E0B" name="Emergency" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Average Daily Patients</p>
                  <p className="text-2xl font-bold text-[#3FB6F6]">156</p>
                  <p className="text-sm text-gray-600">8.3% increase from last month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Emergency Response Time</p>
                  <p className="text-2xl font-bold text-[#34D399]">4.2 min</p>
                  <p className="text-sm text-gray-600">Below target of 5 minutes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Surgery Success Rate</p>
                  <p className="text-2xl font-bold text-[#F59E0B]">98.7%</p>
                  <p className="text-sm text-gray-600">Above national average</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Department Revenue Distribution
                </CardTitle>
                <CardDescription>Revenue contribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance Rankings</CardTitle>
                <CardDescription>Based on revenue, efficiency, and patient satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-gray-500">{dept.value}% of total revenue</p>
                        </div>
                      </div>
                      <Badge style={{ backgroundColor: dept.color, color: "white" }}>Top Performer</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Initiatives</CardTitle>
                <CardDescription>Current strategic projects and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Digital Transformation</p>
                      <Badge className="bg-green-100 text-green-800">75% Complete</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">New Wing Construction</p>
                      <Badge className="bg-blue-100 text-blue-800">45% Complete</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Staff Training Program</p>
                      <Badge className="bg-yellow-100 text-yellow-800">90% Complete</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Strategic KPIs and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Market Share Growth</p>
                      <p className="text-sm text-gray-500">Target: 15%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">12.3%</p>
                      <p className="text-sm text-gray-500">Current</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Patient Retention Rate</p>
                      <p className="text-sm text-gray-500">Target: 85%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">87.2%</p>
                      <p className="text-sm text-gray-500">Current</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cost Reduction</p>
                      <p className="text-sm text-gray-500">Target: 5%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">3.1%</p>
                      <p className="text-sm text-gray-500">Current</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Key insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Positive Trends</h4>
                  <ul className="mt-2 text-sm text-green-700 space-y-1">
                    <li>• Revenue growth exceeding targets by 2.5%</li>
                    <li>• Patient satisfaction scores at all-time high</li>
                    <li>• Operational efficiency improvements of 8%</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Areas for Attention</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Staff turnover in emergency department</li>
                    <li>• Equipment maintenance costs increasing</li>
                    <li>• Waiting times in outpatient services</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Strategic Recommendations</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Invest in telemedicine infrastructure</li>
                    <li>• Expand cardiology department capacity</li>
                    <li>• Implement predictive maintenance program</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
