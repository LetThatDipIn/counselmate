"use client"

import Link from "next/link"
import { Search, ArrowRight, Star, Shield, Zap, Users, MessageSquare, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [specialization, setSpecialization] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen relative flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"></div>
        <div
          className="absolute -bottom-40 right-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}
            style={{ animationDelay: "0.1s", fontFamily: "system-ui" }}
          >
            Connect with the
            <span className="gradient-text-elite block"> Elite Legal Minds</span>
          </h1>

          <p
            className={`text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            Find verified Chartered Accountants and Lawyers instantly. Expert guidance, affordable rates, and verified
            credentials — all in one platform.
          </p>

          <div className={`flex flex-wrap justify-center gap-6 mb-12 ${isVisible ? "animate-fadeInUp" : "opacity-0"}`} style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-2 glass px-6 py-3 rounded-full">
              <Shield className="w-5 h-5 text-blue-300" />
              <span className="text-white font-semibold">100% Verified</span>
            </div>
            <div className="flex items-center gap-2 glass px-6 py-3 rounded-full">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">Instant Connect</span>
            </div>
            <div className="flex items-center gap-2 glass px-6 py-3 rounded-full">
              <Star className="w-5 h-5 text-amber-300" />
              <span className="text-white font-semibold">Top Rated</span>
            </div>
          </div>

          <div className={`${isVisible ? "animate-fadeInUp" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            <div className="glass max-w-2xl mx-auto p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl">
                  <Search className="w-5 h-5 text-blue-300 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Find by expertise or specialization..."
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                </div>
                <Link
                  href="/professionals"
                  className="btn-hover bg-gradient-accent-elite text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Search <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Why <span className="text-[#1e3a8a]">Counsel</span><span className="text-black">Mate</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Experience the future of legal services with cutting-edge technology and trusted professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Professionals",
                desc: "All CAs and Lawyers undergo rigorous background checks and credential verification.",
                color: "from-blue-500 to-indigo-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: Zap,
                title: "Instant Booking",
                desc: "Real-time availability and instant booking confirmation within minutes.",
                color: "from-cyan-500 to-blue-600",
                bgColor: "bg-cyan-50",
              },
              {
                icon: Users,
                title: "Expert Matching",
                desc: "AI-powered matching connects you with the perfect professional for your needs.",
                color: "from-indigo-500 to-purple-600",
                bgColor: "bg-indigo-50",
              },
              {
                icon: MessageSquare,
                title: "Secure Communication",
                desc: "End-to-end encrypted messaging and video consultations built for confidentiality.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
              },
              {
                icon: CheckCircle2,
                title: "Quality Assurance",
                desc: "Transparent reviews, verified feedback, and 100% satisfaction guarantee.",
                color: "from-indigo-600 to-blue-500",
                bgColor: "bg-indigo-50",
              },
              {
                icon: Star,
                title: "Competitive Pricing",
                desc: "Transparent rates with no hidden fees. Compare and choose the best value.",
                color: "from-cyan-500 to-indigo-600",
                bgColor: "bg-cyan-50",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="card-light group relative p-8 rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 bg-white transition-all duration-300 hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
                  ></div>
                  <div className="relative z-10">
                    <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Trusted by <span className="gradient-text-elite">Thousands</span>
            </h2>
            <p className="text-slate-600 text-lg">Join the community transforming professional services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "5,000+", label: "Verified Professionals", icon: Users, color: "from-blue-500 to-indigo-600" },
              { number: "50,000+", label: "Successful Consultations", icon: CheckCircle2, color: "from-indigo-500 to-purple-600" },
              { number: "4.9/5", label: "Average Rating", icon: Star, color: "from-amber-500 to-orange-600" },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="group text-center p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Get Started in 4 Steps</h2>
            <p className="text-gray-300 text-lg">From discovery to consultation in minutes</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Search & Discover",
                desc: "Browse through verified professionals by specialization, experience, and availability.",
              },
              {
                step: "02",
                title: "Review Credentials",
                desc: "Check verified qualifications, certifications, hourly rates, and client reviews.",
              },
              {
                step: "03",
                title: "Book Instantly",
                desc: "Select your preferred time slot and complete secure payment in seconds.",
              },
              {
                step: "04",
                title: "Get Expert Advice",
                desc: "Connect via chat or video and receive professional consultation immediately.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group glass-dark p-8 rounded-2xl flex gap-6 items-start overflow-hidden relative hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied clients who found expert guidance on LegalConsult
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-hover bg-gradient-accent-elite text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/professionals"
              className="btn-hover bg-white/10 backdrop-blur-lg text-white px-10 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20"
            >
              Browse Professionals
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
