import { TrendingUp, Calendar, DollarSign, Star, Users } from "lucide-react"

export default function KPICards() {
  const kpis = [
    {
      icon: Calendar,
      label: "Upcoming Sessions",
      value: "8",
      subtext: "This week",
      color: "primary",
    },
    {
      icon: DollarSign,
      label: "Monthly Earnings",
      value: "₹45,000",
      subtext: "+15% vs last month",
      color: "success",
    },
    {
      icon: Users,
      label: "Active Clients",
      value: "24",
      subtext: "Last 30 days",
      color: "warning",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.9",
      subtext: "Out of 5.0",
      color: "primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <div key={i} className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <Icon className={`w-6 h-6 text-${kpi.color}`} />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-sm text-text-secondary mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-text-primary mb-1">{kpi.value}</p>
            <p className="text-xs text-text-secondary">{kpi.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}
