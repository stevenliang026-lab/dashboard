"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── Mock Data ─── */
const revenueData = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 4800, expenses: 3100 },
  { month: "Mar", revenue: 5100, expenses: 2900 },
  { month: "Apr", revenue: 4900, expenses: 3200 },
  { month: "May", revenue: 5800, expenses: 3000 },
  { month: "Jun", revenue: 6200, expenses: 3400 },
  { month: "Jul", revenue: 7100, expenses: 3300 },
  { month: "Aug", revenue: 6800, expenses: 3500 },
  { month: "Sep", revenue: 7400, expenses: 3200 },
  { month: "Oct", revenue: 7900, expenses: 3600 },
  { month: "Nov", revenue: 8200, expenses: 3800 },
  { month: "Dec", revenue: 9100, expenses: 4000 },
];

const trafficData = [
  { day: "Mon", visitors: 1200, pageviews: 3400 },
  { day: "Tue", visitors: 1400, pageviews: 3800 },
  { day: "Wed", visitors: 1100, pageviews: 3100 },
  { day: "Thu", visitors: 1600, pageviews: 4200 },
  { day: "Fri", visitors: 1800, pageviews: 4800 },
  { day: "Sat", visitors: 900, pageviews: 2200 },
  { day: "Sun", visitors: 700, pageviews: 1800 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#06b6d4" },
  { name: "Clothing", value: 25, color: "#8b5cf6" },
  { name: "Food", value: 20, color: "#f59e0b" },
  { name: "Services", value: 15, color: "#10b981" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const conversionData = [
  { week: "W1", rate: 2.1 }, { week: "W2", rate: 2.4 }, { week: "W3", rate: 2.2 },
  { week: "W4", rate: 2.8 }, { week: "W5", rate: 3.1 }, { week: "W6", rate: 2.9 },
  { week: "W7", rate: 3.4 }, { week: "W8", rate: 3.6 },
];

const recentOrders = [
  { id: "#ORD-7291", customer: "Alice Wang", amount: "$1,240", status: "Completed", date: "Mar 28" },
  { id: "#ORD-7290", customer: "Bob Martinez", amount: "$890", status: "Processing", date: "Mar 28" },
  { id: "#ORD-7289", customer: "Carol Kim", amount: "$2,100", status: "Completed", date: "Mar 27" },
  { id: "#ORD-7288", customer: "David Chen", amount: "$450", status: "Shipped", date: "Mar 27" },
  { id: "#ORD-7287", customer: "Eva Johnson", amount: "$1,670", status: "Completed", date: "Mar 26" },
  { id: "#ORD-7286", customer: "Frank Lee", amount: "$320", status: "Refunded", date: "Mar 26" },
];

const statusColor: Record<string, string> = {
  Completed: "text-emerald-400 bg-emerald-400/10",
  Processing: "text-amber-400 bg-amber-400/10",
  Shipped: "text-blue-400 bg-blue-400/10",
  Refunded: "text-red-400 bg-red-400/10",
};

/* ─── Stat Card ─── */
function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  const isPositive = change.startsWith("+");
  return (
    <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {change} vs last month
      </div>
    </div>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const items = [
    { key: "overview", label: "Overview", icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /> },
    { key: "analytics", label: "Analytics", icon: <><path d="M18 20V10M12 20V4M6 20v-6" /></> },
    { key: "orders", label: "Orders", icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> },
    { key: "products", label: "Products", icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></> },
    { key: "customers", label: "Customers", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-gray-900 border-r border-gray-800 p-4">
      <div className="text-lg font-bold text-cyan-400 mb-8 px-3">InsightBoard</div>
      <nav className="space-y-1 flex-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active === item.key ? "bg-cyan-500/10 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-800 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold">S</div>
          <div>
            <div className="text-sm font-medium">Steven L.</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Page ─── */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Dashboard Overview</h1>
              <p className="text-sm text-gray-500">Welcome back, Steven</p>
            </div>
            <div className="flex items-center gap-2">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    timeRange === range ? "bg-cyan-500/10 text-cyan-400" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value="$84,500"
              change="+12.5%"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
            />
            <StatCard
              title="Total Orders"
              value="1,284"
              change="+8.2%"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>}
            />
            <StatCard
              title="Conversion Rate"
              value="3.6%"
              change="+0.8%"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
            />
            <StatCard
              title="Active Users"
              value="8,942"
              change="-2.1%"
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" /></svg>}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-gray-900 border border-gray-800">
              <h3 className="text-sm font-semibold mb-4">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#revGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#8b5cf6" fill="url(#expGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
              <h3 className="text-sm font-semibold mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-gray-400">{c.name}</span>
                    </div>
                    <span className="text-gray-300 font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic */}
            <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
              <h3 className="text-sm font-semibold mb-4">Weekly Traffic</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="visitors" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pageviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion */}
            <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
              <h3 className="text-sm font-semibold mb-4">Conversion Rate Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} domain={[1.5, 4]} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left py-3 px-2 font-medium">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 font-medium">Amount</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-2 text-gray-300 font-mono">{order.id}</td>
                      <td className="py-3 px-2 text-gray-300">{order.customer}</td>
                      <td className="py-3 px-2 text-gray-300 font-medium">{order.amount}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
