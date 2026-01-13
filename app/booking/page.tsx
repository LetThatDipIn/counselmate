"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingStep {
  step: number
  title: string
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour < 18; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      available: Math.random() > 0.3,
    })
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:30`,
      available: Math.random() > 0.3,
    })
  }
  return slots
}

const steps: BookingStep[] = [
  { step: 1, title: "Select Date & Time" },
  { step: 2, title: "Add Details" },
  { step: 3, title: "Review & Confirm" },
  { step: 4, title: "Payment" },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [notes, setNotes] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  // Mock professional data
  const professional = {
    name: "Rajesh Kumar",
    role: "Chartered Accountant",
    rating: 4.9,
    hourlyRate: 1500,
    avatar: "R",
  }

  const getCurrentMonth = () => {
    const today = new Date()
    return today
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const currentMonth = getCurrentMonth()
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  const calendarDays = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const timeSlots = generateTimeSlots()

  const calculateTotal = () => {
    const durationHours = Number.parseInt(duration) / 60
    return professional.hourlyRate * durationHours
  }

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((s) => (
              <div key={s.step} className="flex-1 mr-2 last:mr-0">
                <div className="relative">
                  <div
                    className={`h-2 rounded-full transition-colors ${
                      currentStep >= s.step ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs mt-2 text-center ${currentStep >= s.step ? "text-primary font-semibold" : "text-text-secondary"}`}
                >
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8">
              {/* Step 1: Select Date & Time */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Select Date & Time</h2>

                  {/* Calendar */}
                  <div className="mb-8 bg-background-light p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-text-primary">
                        {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-text-secondary py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                          }
                          disabled={!day}
                          className={`p-2 rounded-lg text-sm font-semibold transition ${
                            !day
                              ? "invisible"
                              : selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth()
                                ? "bg-primary text-white"
                                : "bg-white border border-border hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <>
                      {/* Duration Selection */}
                      <div className="mb-8">
                        <h3 className="font-semibold text-text-primary mb-3">Session Duration</h3>
                        <div className="flex gap-3">
                          {["30", "60", "120"].map((dur) => (
                            <button
                              key={dur}
                              onClick={() => setDuration(dur)}
                              className={`px-4 py-2 rounded-lg border transition ${
                                duration === dur
                                  ? "bg-primary text-white border-primary"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {dur === "30" ? "30 mins" : dur === "60" ? "1 hour" : "2 hours"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div>
                        <h3 className="font-semibold text-text-primary mb-3">Available Times</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-2 rounded-lg text-sm font-semibold transition ${
                                !slot.available
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : selectedTime === slot.time
                                    ? "bg-primary text-white"
                                    : "bg-white border border-border hover:border-primary"
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Add Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Your Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">Additional Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Describe your issue or what you'd like to discuss..."
                        className="w-full px-4 py-2 border border-border rounded-lg h-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Review Your Booking</h2>
                  <div className="space-y-4">
                    <div className="bg-background-light p-4 rounded-lg">
                      <h3 className="font-semibold text-text-primary mb-4">Booking Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Professional</span>
                          <span className="font-semibold text-text-primary">{professional.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Date</span>
                          <span className="font-semibold text-text-primary">{selectedDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Time</span>
                          <span className="font-semibold text-text-primary">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Duration</span>
                          <span className="font-semibold text-text-primary">
                            {duration === "30" ? "30 mins" : duration === "60" ? "1 hour" : "2 hours"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background-light p-4 rounded-lg">
                      <h3 className="font-semibold text-text-primary mb-4">Your Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Name</span>
                          <span className="font-semibold text-text-primary">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Email</span>
                          <span className="font-semibold text-text-primary">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Phone</span>
                          <span className="font-semibold text-text-primary">{formData.phone}</span>
                        </div>
                      </div>
                    </div>

                    {notes && (
                      <div className="bg-background-light p-4 rounded-lg">
                        <h3 className="font-semibold text-text-primary mb-2">Notes</h3>
                        <p className="text-sm text-text-secondary">{notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Payment</h2>
                  <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-text-primary mb-3">Price Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Hourly Rate</span>
                          <span className="text-text-primary">₹{professional.hourlyRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Duration</span>
                          <span className="text-text-primary">
                            {duration === "30" ? "0.5" : duration === "60" ? "1" : "2"} hour(s)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Platform Fee (10%)</span>
                          <span className="text-text-primary">₹{Math.round(calculateTotal() * 0.1)}</span>
                        </div>
                        <div className="border-t border-primary/20 pt-2 flex justify-between">
                          <span className="font-semibold text-text-primary">Total</span>
                          <span className="font-bold text-lg text-primary">₹{Math.round(calculateTotal() * 1.1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-text-primary mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background-light">
                          <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                          <span className="text-sm font-semibold">Credit/Debit Card</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background-light">
                          <input type="radio" name="payment" className="w-4 h-4" />
                          <span className="text-sm font-semibold">UPI/Net Banking</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background-light">
                          <input type="radio" name="payment" className="w-4 h-4" />
                          <span className="text-sm font-semibold">Digital Wallet</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-success/5 border border-success/20 rounded-lg p-3 flex gap-2 text-sm">
                      <span className="text-success font-semibold">✓</span>
                      <span className="text-success text-sm">Your payment is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-border">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-background-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !selectedTime) ||
                    (currentStep === 2 && !formData.fullName) ||
                    currentStep === 4
                  }
                  className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 4 ? "Complete Booking" : currentStep === 3 ? "Proceed to Payment" : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Professional Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-20 h-fit">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {professional.avatar}
                </div>
                <h3 className="font-bold text-lg text-text-primary">{professional.name}</h3>
                <p className="text-sm text-primary font-semibold">{professional.role}</p>
              </div>

              <div className="border-t border-b border-border py-3 mb-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-lg font-bold text-text-primary">4.9</span>
                  <span className="text-warning">★</span>
                </div>
                <p className="text-xs text-text-secondary text-center">Based on 124 reviews</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{professional.hourlyRate} per hour</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>Responds within 1 hour</span>
                </div>
              </div>

              <div className="bg-background-light rounded-lg p-3 mt-4 text-center">
                <p className="text-xs text-text-secondary mb-1">Estimated Total</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(calculateTotal() * 1.1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
