"use client"

import { useState } from "react"
import { Clock, DollarSign, TrendingUp } from "lucide-react"
import DashboardHeader from "@/components/dashboard/header"
import KPICards from "@/components/dashboard/kpi-cards"
import SessionsTable from "@/components/dashboard/sessions-table"
import RevenueChart from "@/components/dashboard/revenue-chart"
import ClientsList from "@/components/dashboard/clients-list"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background-light">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {[
            { id: "overview", label: "Overview" },
            { id: "sessions", label: "Sessions" },
            { id: "clients", label: "Clients" },
            { id: "earnings", label: "Earnings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 border-b-2 font-semibold transition ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <KPICards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="font-bold text-lg text-text-primary mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">Profile Completion</span>
                      <span className="text-sm font-semibold text-text-primary">85%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">Response Rate</span>
                      <span className="text-sm font-semibold text-success">98%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">Client Rating</span>
                      <span className="text-sm font-semibold text-warning">4.9/5</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <SessionsTable limit={5} />
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && <SessionsTable />}

        {/* Clients Tab */}
        {activeTab === "clients" && <ClientsList />}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">This Month</span>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <p className="text-3xl font-bold text-text-primary">₹45,000</p>
                <p className="text-xs text-success mt-2">+15% from last month</p>
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">This Year</span>
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-text-primary">₹4,20,000</p>
                <p className="text-xs text-text-secondary mt-2">From 284 sessions</p>
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Pending Payouts</span>
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <p className="text-3xl font-bold text-text-primary">₹12,500</p>
                <p className="text-xs text-text-secondary mt-2">Next payout in 2 days</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-bold text-lg text-text-primary mb-6">Earnings Breakdown</h3>
              <div className="space-y-4">
                {[
                  { category: "Consultations", amount: 180000, percentage: 43 },
                  { category: "Document Reviews", amount: 120000, percentage: 29 },
                  { category: "Legal Drafting", amount: 80000, percentage: 19 },
                  { category: "Other Services", amount: 40000, percentage: 9 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-text-primary">{item.category}</span>
                      <span className="text-sm text-text-secondary">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
