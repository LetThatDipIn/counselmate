"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const revenueData = [
  { week: "Week 1", revenue: 8000 },
  { week: "Week 2", revenue: 12000 },
  { week: "Week 3", revenue: 10500 },
  { week: "Week 4", revenue: 15000 },
  { week: "Week 5", revenue: 18000 },
]

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="font-bold text-lg text-text-primary mb-6">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#1a237e" dot={{ fill: "#1a237e", r: 5 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
