"use client";

import { useState, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ── Seeded RNG ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/* ── 365 Days of Data ── */
function generateDailyData() {
  const rand = seededRandom(42);
  const data = [];
  const start = new Date(2025, 3, 1);

  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const monthFactor = 1 + (i / 365) * 0.4;
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

/* ── Orders Data ── */
function generateOrders() {
  const rand = seededRandom(99);
  const names = [
    "Alice Wang", "Bob Martinez", "Carol Kim", "David Chen", "Eva Johnson",
    "Frank Lee", "Grace Liu", "Henry Park", "Iris Zhang", "Jack Wilson",
    "Kate Brown", "Leo Yang", "Mia Thompson", "Noah Garcia", "Olivia Tanaka",
    "Peter Singh", "Quinn Adams", "Rachel Wu", "Sam Miller", "Tina Nakamura",
    "Uma Patel", "Victor Huang", "Wendy Scott", "Xavier Li", "Yuki Sato",
    "Zara Khan", "Andy Moore", "Beth Collins", "Chris Nguyen", "Diana Ross",
  ];
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

/* ── Customers Data ── */
function generateCustomers() {
  const rand = seededRandom(77);
  const names = [
    "Alice Wang", "Bob Martinez", "Carol Kim", "David Chen", "Eva Johnson",
    "Frank Lee", "Grace Liu", "Henry Park", "Iris Zhang", "Jack Wilson",
    "Kate Brown", "Leo Yang", "Mia Thompson", "Noah Garcia", "Olivia Tanaka",
  ];
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

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 20 },
  { name: "Services", value: 15 },
  { name: "Other", value: 5 },
];

const PIE_SHADES = ["#e5e5e5", "#a3a3a3", "#737373", "#525252", "#404040"];

const CHART_BORDER = "#1a1a1a";
const CHART_GRID = "#1a1a1a";
const ACCENT = "#3b82f6";
const ACCENT_DIM = "#2563eb";
const TEXT_MUTED = "#525252";
const TEXT_SEC = "#a3a3a3";

/* ── Tooltip style shared across all charts ── */
const tooltipStyle = {
  backgroundColor: "#141414",
  border: "1px solid #1a1a1a",
  borderRadius: "4px",
  color: "#e5e5e5",
  fontSize: "12px",
  padding: "8px 12px",
};

/* ── Stat Metric ── */
function Metric({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = !delta.startsWith("-");
  return (
    <div className="py-4 px-5 border border-[#1a1a1a] rounded-md bg-[#111111]">
      <p className="text-xs font-medium text-[#525252] tracking-wide uppercase mb-2">{label}</p>
      <p className="text-xl font-semibold text-white tabular-nums">{value}</p>
      <p className={`text-xs mt-1 tabular-nums ${positive ? "text-[#a3a3a3]" : "text-[#ef4444]"}`}>
        {positive ? "+" : ""}{delta}% vs prev period
      </p>
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const items = [
    { key: "overview", label: "Overview" },
    { key: "analytics", label: "Analytics" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-48 border-r border-[#1a1a1a] bg-[#0a0a0a] pt-6 pb-4 px-3">
      <div className="text-sm font-semibold text-white tracking-tight mb-8 px-3">Dashboard</div>
      <nav className="flex-1 space-y-0.5">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full text-left px-3 py-2 text-[13px] rounded transition-colors ${
              active === item.key
                ? "text-white bg-[#1a1a1a] font-medium"
                : "text-[#525252] hover:text-[#a3a3a3]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-3 pt-4 border-t border-[#1a1a1a] mt-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[11px] font-medium text-[#a3a3a3]">S</div>
          <div>
            <p className="text-[13px] font-medium text-white leading-tight">Steven L.</p>
            <p className="text-[11px] text-[#525252]">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Mobile nav ── */
function MobileNav({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const items = ["overview", "analytics", "orders", "customers", "settings"];
  return (
    <div className="lg:hidden flex border-b border-[#1a1a1a] bg-[#0a0a0a] overflow-x-auto">
      {items.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-3 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
            active === key
              ? "border-white text-white font-medium"
              : "border-transparent text-[#525252] hover:text-[#a3a3a3]"
          }`}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  );
}

/* ── Overview Page ── */
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Revenue" value={`$${curRev.toLocaleString()}`} delta={pct(curRev, prevRev)} />
        <Metric label="Orders" value={curOrd.toLocaleString()} delta={pct(curOrd, prevOrd)} />
        <Metric label="Conversion" value={`${curConv.toFixed(1)}%`} delta={pct(curConv, prevConv)} />
        <Metric label="Users" value={curVis.toLocaleString()} delta={pct(curVis, prevVis)} />
      </div>

      {/* Revenue vs Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
          <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="none" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke={ACCENT} fill="url(#rg)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="expenses" stroke="#525252" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3 pl-1">
            <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
              <span className="w-3 h-[2px] rounded-full" style={{ backgroundColor: ACCENT }} /> Revenue
            </span>
            <span className="flex items-center gap-2 text-[11px] text-[#525252]">
              <span className="w-3 h-[2px] rounded-full border-b border-dashed border-[#525252]" /> Expenses
            </span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
          <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Categories</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_SHADES[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: PIE_SHADES[i] }} />
                  <span className="text-[#a3a3a3]">{c.name}</span>
                </div>
                <span className="text-white font-medium tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
          <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyTraffic} barGap={2}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="none" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="visitors" fill="#404040" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pageviews" fill="#262626" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3 pl-1">
            <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#404040]" /> Visitors
            </span>
            <span className="flex items-center gap-2 text-[11px] text-[#525252]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#262626]" /> Pageviews
            </span>
          </div>
        </div>
        <div className="p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
          <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Conversion Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={conversionTrend}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="none" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.5, 5]} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke={ACCENT} strokeWidth={1.5} dot={{ fill: "#0a0a0a", stroke: ACCENT, strokeWidth: 2, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-[13px] font-medium text-[#a3a3a3]">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[#525252] border-b border-[#1a1a1a]">
                <th className="text-left py-2.5 px-5 font-normal">ID</th>
                <th className="text-left py-2.5 px-5 font-normal">Customer</th>
                <th className="text-left py-2.5 px-5 font-normal">Amount</th>
                <th className="text-left py-2.5 px-5 font-normal">Status</th>
                <th className="text-left py-2.5 px-5 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#141414] transition-colors">
                  <td className="py-2.5 px-5 text-[#a3a3a3] font-mono text-[12px]">{o.id}</td>
                  <td className="py-2.5 px-5 text-white">{o.customer}</td>
                  <td className="py-2.5 px-5 text-white font-medium tabular-nums">${o.amount.toLocaleString()}</td>
                  <td className="py-2.5 px-5 text-[#525252]">{o.status}</td>
                  <td className="py-2.5 px-5 text-[#525252]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics Page ── */
function AnalyticsPage({ timeRange }: { timeRange: "7d" | "30d" | "90d" }) {
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const data = ALL_DATA.slice(-days);

  const dailyRevenue = data.map((d) => ({ date: d.date.slice(5), revenue: d.revenue, orders: d.orders }));
  const dailyVisitors = data.map((d) => ({ date: d.date.slice(5), visitors: d.visitors, conversion: d.conversion }));

  return (
    <div className="space-y-3">
      <div className="p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
        <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Daily Revenue & Orders ({days}d)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyRevenue}>
            <CartesianGrid stroke={CHART_GRID} strokeDasharray="none" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: TEXT_MUTED, fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(days / 10)} />
            <YAxis yAxisId="rev" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar yAxisId="rev" dataKey="revenue" fill="#333333" radius={[1, 1, 0, 0]} />
            <Line yAxisId="ord" type="monotone" dataKey="orders" stroke={ACCENT} strokeWidth={1.5} dot={false} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 pl-1">
          <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#333333]" /> Revenue
          </span>
          <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
            <span className="w-3 h-[2px] rounded-full" style={{ backgroundColor: ACCENT }} /> Orders
          </span>
        </div>
      </div>

      <div className="p-5 rounded-md border border-[#1a1a1a] bg-[#111111]">
        <h3 className="text-[13px] font-medium text-[#a3a3a3] mb-4">Visitors & Conversion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyVisitors}>
            <defs>
              <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#404040" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#404040" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART_GRID} strokeDasharray="none" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: TEXT_MUTED, fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(days / 10)} />
            <YAxis yAxisId="vis" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="conv" orientation="right" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area yAxisId="vis" type="monotone" dataKey="visitors" stroke="#525252" fill="url(#vg)" strokeWidth={1.5} dot={false} />
            <Line yAxisId="conv" type="monotone" dataKey="conversion" stroke={ACCENT} strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 pl-1">
          <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#525252]" /> Visitors
          </span>
          <span className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
            <span className="w-3 h-[2px] rounded-full" style={{ backgroundColor: ACCENT }} /> Conversion
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Orders Page ── */
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

  const SortArrow = ({ col }: { col: string }) => (
    sortKey === col ? <span className="ml-1 text-white">{sortDir === "asc" ? "\u2191" : "\u2193"}</span> : null
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search orders..."
          className="flex-1 px-3 py-2 rounded bg-[#111111] border border-[#1a1a1a] text-[13px] text-white placeholder-[#404040] focus:border-[#333333] focus:outline-none transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded bg-[#111111] border border-[#1a1a1a] text-[13px] text-[#a3a3a3] focus:border-[#333333] focus:outline-none transition-colors"
        >
          {["All", "Completed", "Processing", "Shipped", "Refunded"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a]">
          <p className="text-[13px] font-medium text-[#a3a3a3]">{filtered.length} orders</p>
          <p className="text-[12px] text-[#525252] tabular-nums">{page + 1} / {totalPages}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[#525252] border-b border-[#1a1a1a]">
                <th className="text-left py-2.5 px-5 font-normal cursor-pointer hover:text-[#a3a3a3] select-none" onClick={() => handleSort("id")}>ID<SortArrow col="id" /></th>
                <th className="text-left py-2.5 px-5 font-normal cursor-pointer hover:text-[#a3a3a3] select-none" onClick={() => handleSort("customer")}>Customer<SortArrow col="customer" /></th>
                <th className="text-left py-2.5 px-5 font-normal cursor-pointer hover:text-[#a3a3a3] select-none" onClick={() => handleSort("amount")}>Amount<SortArrow col="amount" /></th>
                <th className="text-left py-2.5 px-5 font-normal">Status</th>
                <th className="text-left py-2.5 px-5 font-normal cursor-pointer hover:text-[#a3a3a3] select-none" onClick={() => handleSort("date")}>Date<SortArrow col="date" /></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((o) => (
                <tr key={o.id} onClick={() => setSelectedOrder(o)} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#141414] transition-colors cursor-pointer">
                  <td className="py-2.5 px-5 text-[#a3a3a3] font-mono text-[12px]">{o.id}</td>
                  <td className="py-2.5 px-5 text-white">{o.customer}</td>
                  <td className="py-2.5 px-5 text-white font-medium tabular-nums">${o.amount.toLocaleString()}</td>
                  <td className="py-2.5 px-5 text-[#525252]">{o.status}</td>
                  <td className="py-2.5 px-5 text-[#525252]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a1a1a]">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded text-[12px] text-[#525252] hover:text-white disabled:opacity-20 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page < 3 ? i : page + i - 2;
              if (p >= totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-[12px] tabular-nums transition-colors ${
                    p === page ? "bg-[#1a1a1a] text-white font-medium" : "text-[#525252] hover:text-white"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded text-[12px] text-[#525252] hover:text-white disabled:opacity-20 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order detail panel */}
      {selectedOrder && (
        <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a]">
            <p className="text-[13px] font-medium text-white">Order {selectedOrder.id}</p>
            <button onClick={() => setSelectedOrder(null)} className="text-[#525252] hover:text-white text-[13px] transition-colors">Close</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1a1a1a]">
            {[
              ["ID", selectedOrder.id],
              ["Customer", selectedOrder.customer],
              ["Email", selectedOrder.email],
              ["Amount", `$${selectedOrder.amount.toLocaleString()}`],
              ["Status", selectedOrder.status],
              ["Date", selectedOrder.date],
            ].map(([label, val]) => (
              <div key={label} className="bg-[#111111] px-5 py-3">
                <p className="text-[11px] text-[#525252] mb-1">{label}</p>
                <p className="text-[13px] text-white truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Customers Page ── */
function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = ALL_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search customers..."
        className="w-full sm:w-72 px-3 py-2 rounded bg-[#111111] border border-[#1a1a1a] text-[13px] text-white placeholder-[#404040] focus:border-[#333333] focus:outline-none transition-colors"
      />

      <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[#525252] border-b border-[#1a1a1a]">
                <th className="text-left py-2.5 px-5 font-normal">Name</th>
                <th className="text-left py-2.5 px-5 font-normal hidden sm:table-cell">Email</th>
                <th className="text-left py-2.5 px-5 font-normal">Orders</th>
                <th className="text-left py-2.5 px-5 font-normal">Spent</th>
                <th className="text-left py-2.5 px-5 font-normal hidden sm:table-cell">Last Order</th>
                <th className="text-left py-2.5 px-5 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#141414] transition-colors">
                  <td className="py-2.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[10px] font-medium text-[#a3a3a3] shrink-0">{c.name[0]}</div>
                      <span className="text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-5 text-[#525252] hidden sm:table-cell">{c.email}</td>
                  <td className="py-2.5 px-5 text-white tabular-nums">{c.orders}</td>
                  <td className="py-2.5 px-5 text-white font-medium tabular-nums">${(c.spent / 1000).toFixed(1)}k</td>
                  <td className="py-2.5 px-5 text-[#525252] hidden sm:table-cell">{c.lastOrder}</td>
                  <td className="py-2.5 px-5">
                    <span className={c.status === "Active" ? "text-white" : "text-[#404040]"}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Settings Page ── */
function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });

  return (
    <div className="max-w-xl space-y-3">
      <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1a1a1a]">
          <h3 className="text-[13px] font-medium text-white">Notifications</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {([
            ["email", "Email notifications", "Order updates via email"],
            ["push", "Push notifications", "Browser alerts for urgent events"],
            ["weekly", "Weekly digest", "Summary report every Monday"],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[13px] text-white">{label}</p>
                <p className="text-[12px] text-[#525252] mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  notifications[key] ? "bg-[#3b82f6]" : "bg-[#262626]"
                }`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ left: notifications[key] ? "18px" : "2px" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-[#1a1a1a] bg-[#111111] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1a1a1a]">
          <h3 className="text-[13px] font-medium text-white">Account</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {[
            ["Name", "Steven Liang"],
            ["Email", "stevenliang026@gmail.com"],
            ["Role", "Admin"],
            ["Timezone", "UTC+8 (Asia/Shanghai)"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between px-5 py-3 text-[13px]">
              <span className="text-[#525252]">{label}</span>
              <span className="text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
const pageTitles: Record<string, string> = {
  overview: "Overview",
  analytics: "Analytics",
  orders: "Orders",
  customers: "Customers",
  settings: "Settings",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav active={activeTab} onChange={setActiveTab} />
        <header className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-white">{pageTitles[activeTab]}</h1>
            </div>
            {(activeTab === "overview" || activeTab === "analytics") && (
              <div className="flex items-center gap-1">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded text-[12px] transition-colors ${
                      timeRange === range
                        ? "bg-[#1a1a1a] text-white font-medium"
                        : "text-[#525252] hover:text-[#a3a3a3]"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
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
