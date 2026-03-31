"use client";

import { useState, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── Seeded Random for Consistent Data ─── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/* ─── Generate 365 Days of Data ─── */
function generateDailyData() {
  const rand = seededRandom(42);
  const data = [];
  const start = new Date(2025, 3, 1); // Apr 1 2025

  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const monthFactor = 1 + (i / 365) * 0.4; // growth trend
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;

    const baseRevenue = (200 + rand() * 300) * monthFactor * weekendDip;
    const orders = Math.floor((5 + rand() * 15) * monthFactor * weekendDip);
    const visitors = Math.floor((80 + rand() * 200) * monthFactor * weekendDip);
    const conversion = 1.5 + rand() * 3.5;

    data.push({
      date: d.toISOString().split("T")[0],
      dateObj: d,
      month: d.toLocaleString("en", { month: "short" }),
      day: d.toLocaleString("en", { weekday: "short" }),
      revenue: Math.round(baseRevenue),
      expenses: Math.round(baseRevenue * (0.4 + rand() * 0.25)),
      orders,
      visitors,
      pageviews: Math.floor(visitors * (2 + rand() * 2)),
      conversion: Math.round(conversion * 100) / 100,
    });
  }
  return data;
}

const ALL_DATA = generateDailyData();

/* ─── Generate Orders ─── */
function generateOrders() {
  const rand = seededRandom(99);
  const names = ["Alice Wang", "Bob Martinez", "Carol Kim", "David Chen", "Eva Johnson",
    "Frank Lee", "Grace Liu", "Henry Park", "Iris Zhang", "Jack Wilson",
    "Kate Brown", "Leo Yang", "Mia Thompson", "Noah Garcia", "Olivia Tanaka",
    "Peter Singh", "Quinn Adams", "Rachel Wu", "Sam Miller", "Tina Nakamura",
    "Uma Patel", "Victor Huang", "Wendy Scott", "Xavier Li", "Yuki Sato",
    "Zara Khan", "Andy Moore", "Beth Collins", "Chris Nguyen", "Diana Ross"];
  const statuses = ["Completed", "Processing", "Shipped", "Refunded"];
  const orders = [];

  for (let i = 0; i < 80; i++) {
    const d = new Date(2026, 2, 31);
    d.setDate(d.getDate() - Math.floor(rand() * 60));
    orders.push({
      id: `#ORD-${7300 - i}`,
      customer: names[Math.floor(rand() * names.length)],
      email: `user${i}@example.com`,
      amount: Math.round(100 + rand() * 3000),
      status: statuses[Math.floor(rand() * (i < 10 ? 2 : statuses.length))],
      date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      dateObj: d,
    });
  }
  return orders.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

const ALL_ORDERS = generateOrders();

/* ─── Customers Data ─── */
function generateCustomers() {
  const rand = seededRandom(77);
  const names = ["Alice Wang", "Bob Martinez", "Carol Kim", "David Chen", "Eva Johnson",
    "Frank Lee", "Grace Liu", "Henry Park", "Iris Zhang", "Jack Wilson",
    "Kate Brown", "Leo Yang", "Mia Thompson", "Noah Garcia", "Olivia Tanaka"];
  return names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@company.com`,
    orders: Math.floor(3 + rand() * 20),
    spent: Math.round(500 + rand() * 8000),
    lastOrder: `Mar ${10 + Math.floor(rand() * 20)}`,
    status: rand() > 0.3 ? "Active" : "Inactive",
  }));
}

const ALL_CUSTOMERS = generateCustomers();

const statusColor: Record<string, string> = {
  Completed: "text-emerald-400 bg-emerald-400/10",
  Processing: "text-amber-400 bg-amber-400/10",
  Shipped: "text-blue-400 bg-blue-400/10",
  Refunded: "text-red-400 bg-red-400/10",
  Active: "text-emerald-400 bg-emerald-400/10",
  Inactive: "text-gray-400 bg-gray-400/10",
};

const categoryData = [
  { name: "Electronics", value: 35, color: "#06b6d4" },
  { name: "Clothing", value: 25, color: "#8b5cf6" },
  { name: "Food", value: 20, color: "#f59e0b" },
  { name: "Services", value: 15, color: "#10b981" },
  { name: "Other", value: 5, color: "#6b7280" },
];

/* ─── Stat Card ─── */
function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  const isPositive = !change.startsWith("-");
  return (
    <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{change}% vs prev period
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
    { key: "customers", label: "Customers", icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></> },
    { key: "settings", label: "Settings", icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></> },
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

/* ─── Overview Page ─── */
function OverviewPage({ timeRange }: { timeRange: "7d" | "30d" | "90d" }) {
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const currentData = ALL_DATA.slice(-days);
  const prevData = ALL_DATA.slice(-days * 2, -days);

  const sum = (arr: typeof ALL_DATA, key: "revenue" | "orders" | "visitors") =>
    arr.reduce((s, d) => s + d[key], 0);
  const avg = (arr: typeof ALL_DATA, key: "conversion") =>
    arr.reduce((s, d) => s + d[key], 0) / (arr.length || 1);

  const curRev = sum(currentData, "revenue");
  const prevRev = sum(prevData, "revenue") || 1;
  const curOrd = sum(currentData, "orders");
  const prevOrd = sum(prevData, "orders") || 1;
  const curVis = sum(currentData, "visitors");
  const prevVis = sum(prevData, "visitors") || 1;
  const curConv = avg(currentData, "conversion");
  const prevConv = avg(prevData, "conversion") || 1;

  const pct = (cur: number, prev: number) => ((cur - prev) / prev * 100).toFixed(1);

  // Aggregate by month for chart
  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; revenue: number; expenses: number }>();
    currentData.forEach((d) => {
      const existing = map.get(d.month) || { month: d.month, revenue: 0, expenses: 0 };
      existing.revenue += d.revenue;
      existing.expenses += d.expenses;
      map.set(d.month, existing);
    });
    return Array.from(map.values());
  }, [currentData]);

  // Weekly traffic from current data
  const weeklyTraffic = useMemo(() => {
    const map = new Map<string, { day: string; visitors: number; pageviews: number }>();
    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    dayOrder.forEach((d) => map.set(d, { day: d, visitors: 0, pageviews: 0 }));
    const last7 = currentData.slice(-7);
    last7.forEach((d) => {
      const existing = map.get(d.day)!;
      existing.visitors += d.visitors;
      existing.pageviews += d.pageviews;
    });
    return dayOrder.map((d) => map.get(d)!);
  }, [currentData]);

  // Conversion trend
  const conversionTrend = useMemo(() => {
    const weeks: { week: string; rate: number }[] = [];
    for (let i = 0; i < Math.min(8, Math.floor(currentData.length / 7)); i++) {
      const slice = currentData.slice(i * 7, (i + 1) * 7);
      const avgRate = slice.reduce((s, d) => s + d.conversion, 0) / slice.length;
      weeks.push({ week: `W${i + 1}`, rate: Math.round(avgRate * 100) / 100 });
    }
    return weeks;
  }, [currentData]);

  const recentOrders = ALL_ORDERS.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${curRev.toLocaleString()}`} change={pct(curRev, prevRev)}
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>} />
        <StatCard title="Total Orders" value={curOrd.toLocaleString()} change={pct(curOrd, prevOrd)}
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>} />
        <StatCard title="Conversion Rate" value={`${curConv.toFixed(1)}%`} change={pct(curConv, prevConv)}
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>} />
        <StatCard title="Active Users" value={curVis.toLocaleString()} change={pct(curVis, prevVis)}
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-sm font-semibold mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
              <Legend /><Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#rg)" strokeWidth={2} /><Area type="monotone" dataKey="expenses" stroke="#8b5cf6" fill="url(#eg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-sm font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
              {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">{categoryData.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-gray-400">{c.name}</span></div>
              <span className="text-gray-300 font-medium">{c.value}%</span>
            </div>
          ))}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-sm font-semibold mb-4">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" /><XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} /><Legend />
              <Bar dataKey="visitors" fill="#06b6d4" radius={[4, 4, 0, 0]} /><Bar dataKey="pageviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <h3 className="text-sm font-semibold mb-4">Conversion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" /><XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} domain={[1.5, 5]} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="text-gray-500 border-b border-gray-800">
            <th className="text-left py-3 px-2 font-medium">Order ID</th><th className="text-left py-3 px-2 font-medium">Customer</th>
            <th className="text-left py-3 px-2 font-medium">Amount</th><th className="text-left py-3 px-2 font-medium">Status</th>
            <th className="text-left py-3 px-2 font-medium">Date</th>
          </tr></thead><tbody>{recentOrders.map((o) => (
            <tr key={o.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td className="py-3 px-2 text-gray-300 font-mono">{o.id}</td><td className="py-3 px-2 text-gray-300">{o.customer}</td>
              <td className="py-3 px-2 text-gray-300 font-medium">${o.amount.toLocaleString()}</td>
              <td className="py-3 px-2"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span></td>
              <td className="py-3 px-2 text-gray-500">{o.date}</td>
            </tr>
          ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics Page ─── */
function AnalyticsPage({ timeRange }: { timeRange: "7d" | "30d" | "90d" }) {
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const data = ALL_DATA.slice(-days);

  const dailyRevenue = data.map((d) => ({ date: d.date.slice(5), revenue: d.revenue, orders: d.orders }));
  const dailyVisitors = data.map((d) => ({ date: d.date.slice(5), visitors: d.visitors, conversion: d.conversion }));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Daily Revenue & Orders ({days} days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(days / 10)} />
            <YAxis yAxisId="rev" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
            <Legend /><Bar yAxisId="rev" dataKey="revenue" fill="#06b6d4" radius={[2, 2, 0, 0]} />
            <Line yAxisId="ord" type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Visitors & Conversion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyVisitors}>
            <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(days / 10)} />
            <YAxis yAxisId="vis" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="conv" orientation="right" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#fff" }} />
            <Legend /><Area yAxisId="vis" type="monotone" dataKey="visitors" stroke="#8b5cf6" fill="url(#vg)" strokeWidth={2} />
            <Line yAxisId="conv" type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Orders Page ─── */
function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"id" | "customer" | "amount" | "date">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<typeof ALL_ORDERS[0] | null>(null);
  const perPage = 10;

  const handleSort = useCallback((key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  }, [sortKey]);

  const filtered = useMemo(() => {
    let result = ALL_ORDERS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") result = result.filter((o) => o.status === statusFilter);
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") cmp = a.amount - b.amount;
      else if (sortKey === "date") cmp = a.dateObj.getTime() - b.dateObj.getTime();
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(page * perPage, (page + 1) * perPage);

  const SortIcon = ({ col }: { col: string }) => (
    sortKey === col ? <span className="ml-1 text-cyan-400">{sortDir === "asc" ? "↑" : "↓"}</span> : null
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search orders or customers..." className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none">
          {["All", "Completed", "Processing", "Shipped", "Refunded"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Orders ({filtered.length})</h3>
          <span className="text-xs text-gray-500">Page {page + 1} of {totalPages}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="text-gray-500 border-b border-gray-800">
            <th className="text-left py-3 px-2 font-medium cursor-pointer hover:text-white" onClick={() => handleSort("id")}>Order ID<SortIcon col="id" /></th>
            <th className="text-left py-3 px-2 font-medium cursor-pointer hover:text-white" onClick={() => handleSort("customer")}>Customer<SortIcon col="customer" /></th>
            <th className="text-left py-3 px-2 font-medium cursor-pointer hover:text-white" onClick={() => handleSort("amount")}>Amount<SortIcon col="amount" /></th>
            <th className="text-left py-3 px-2 font-medium">Status</th>
            <th className="text-left py-3 px-2 font-medium cursor-pointer hover:text-white" onClick={() => handleSort("date")}>Date<SortIcon col="date" /></th>
          </tr></thead><tbody>{pageData.map((o) => (
            <tr key={o.id} onClick={() => setSelectedOrder(o)} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer">
              <td className="py-3 px-2 text-gray-300 font-mono">{o.id}</td><td className="py-3 px-2 text-gray-300">{o.customer}</td>
              <td className="py-3 px-2 text-gray-300 font-medium">${o.amount.toLocaleString()}</td>
              <td className="py-3 px-2"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span></td>
              <td className="py-3 px-2 text-gray-500">{o.date}</td>
            </tr>
          ))}</tbody></table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 disabled:opacity-30 hover:text-white transition-colors">Previous</button>
          <div className="flex gap-1">{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = page < 3 ? i : page + i - 2;
            if (p >= totalPages) return null;
            return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs ${p === page ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 hover:text-white"}`}>{p + 1}</button>;
          })}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-400 disabled:opacity-30 hover:text-white transition-colors">Next</button>
        </div>
      </div>

      {selectedOrder && (
        <div className="p-5 rounded-xl bg-gray-900 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-cyan-400">Order Details</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500 block text-xs mb-1">Order ID</span><span className="font-mono">{selectedOrder.id}</span></div>
            <div><span className="text-gray-500 block text-xs mb-1">Customer</span>{selectedOrder.customer}</div>
            <div><span className="text-gray-500 block text-xs mb-1">Amount</span><span className="font-medium">${selectedOrder.amount.toLocaleString()}</span></div>
            <div><span className="text-gray-500 block text-xs mb-1">Status</span><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selectedOrder.status]}`}>{selectedOrder.status}</span></div>
            <div><span className="text-gray-500 block text-xs mb-1">Email</span>{selectedOrder.email}</div>
            <div><span className="text-gray-500 block text-xs mb-1">Date</span>{selectedOrder.date}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customers Page ─── */
function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = ALL_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
        className="w-full sm:w-80 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.name} className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold">{c.name[0]}</div>
              <div><div className="text-sm font-medium">{c.name}</div><div className="text-xs text-gray-500">{c.email}</div></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-lg font-bold">{c.orders}</div><div className="text-xs text-gray-500">Orders</div></div>
              <div><div className="text-lg font-bold">${(c.spent / 1000).toFixed(1)}k</div><div className="text-xs text-gray-500">Spent</div></div>
              <div><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Last order: {c.lastOrder}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Page ─── */
function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {([["email", "Email Notifications", "Receive order updates via email"],
            ["push", "Push Notifications", "Browser push notifications for urgent alerts"],
            ["weekly", "Weekly Report", "Get a weekly summary every Monday"]] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><div className="text-sm">{label}</div><div className="text-xs text-gray-500">{desc}</div></div>
              <button onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-cyan-500" : "bg-gray-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications[key] ? "left-5.5 translate-x-0" : "left-0.5"}`}
                  style={{ left: notifications[key] ? "22px" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <h3 className="text-sm font-semibold mb-4">Account</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Name</span><span>Steven Liang</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Email</span><span>stevenliang026@gmail.com</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Role</span><span>Admin</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Timezone</span><span>UTC+8 (Asia/Shanghai)</span></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const tabTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  analytics: "Analytics",
  orders: "Orders Management",
  customers: "Customers",
  settings: "Settings",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{tabTitles[activeTab]}</h1>
              <p className="text-sm text-gray-500">Welcome back, Steven</p>
            </div>
            {(activeTab === "overview" || activeTab === "analytics") && (
              <div className="flex items-center gap-2">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button key={range} onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeRange === range ? "bg-cyan-500/10 text-cyan-400" : "text-gray-500 hover:text-white"}`}>
                    {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="p-6">
          {activeTab === "overview" && <OverviewPage timeRange={timeRange} />}
          {activeTab === "analytics" && <AnalyticsPage timeRange={timeRange} />}
          {activeTab === "orders" && <OrdersPage />}
          {activeTab === "customers" && <CustomersPage />}
          {activeTab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
