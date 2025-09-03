"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [showScheduler, setShowScheduler] = useState(false)

  const handleDateChange = (dateStr: string) => {
    if (dateStr) {
      const date = new Date(dateStr)
      onChange(date)
    } else {
      onChange(undefined)
    }
  }

  const handleTimeChange = (timeStr: string) => {
    if (value && timeStr) {
      const [hours, minutes] = timeStr.split(":")
      const newDate = new Date(value)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange(newDate)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-purple-300">Schedule Post</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowScheduler(!showScheduler)}
          className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {showScheduler ? "Post Now" : "Schedule"}
        </Button>
      </div>

      {showScheduler && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date" className="text-purple-300 text-sm">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={value ? format(value, "yyyy-MM-dd") : ""}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-slate-700/50 border-purple-700/50 text-white"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-purple-300 text-sm">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={value ? format(value, "HH:mm") : ""}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-slate-700/50 border-purple-700/50 text-white"
            />
          </div>
        </div>
      )}

      {value && (
        <div className="text-sm text-purple-300 bg-slate-700/30 p-2 rounded border border-purple-700/30">
          <Clock className="h-4 w-4 inline mr-2" />
          Scheduled for: {format(value, "PPP p")}
        </div>
      )}
    </div>
  )
}
