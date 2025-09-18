"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  step?: number // minute step, default 5
  placeholder?: string
  className?: string
}

export function TimePicker({ value, onChange, step = 5, placeholder = "Chọn thời gian", className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value || "")
  // 12h format
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = React.useState<number | null>(null)
  const [ampm, setAmpm] = React.useState<'AM' | 'PM'>('AM')
  const [tempHour, setTempHour] = React.useState<number | null>(null)
  const [tempMinute, setTempMinute] = React.useState<number | null>(null)
  const [tempAmpm, setTempAmpm] = React.useState<'AM' | 'PM'>('AM')

  React.useEffect(() => {
    setInternalValue(value || "")
    if (value) {
      // parse value: 03:30 PM
      const match = value.match(/(\d{2}):(\d{2}) ?(AM|PM)?/i)
      if (match) {
        let h = Number(match[1])
        const m = Number(match[2])
        let ap: 'AM' | 'PM' = 'AM'
        if (match[3]) ap = match[3].toUpperCase() as 'AM' | 'PM'
        setSelectedHour(h)
        setSelectedMinute(m)
        setAmpm(ap)
        setTempHour(h)
        setTempMinute(m)
        setTempAmpm(ap)
      }
    } else {
      setSelectedHour(null)
      setSelectedMinute(null)
      setAmpm('AM')
      setTempHour(null)
      setTempMinute(null)
      setTempAmpm('AM')
    }
  }, [value])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
  const minutes = Array.from({ length: 60 / step }, (_, i) => i * step)
  const ampmOptions: ('AM' | 'PM')[] = ['AM', 'PM']

  function handleHourSelect(h: number) {
    setTempHour(h)
  }
  function handleMinuteSelect(m: number) {
    setTempMinute(m)
  }
  function handleAmpmSelect(ap: 'AM' | 'PM') {
    setTempAmpm(ap)
  }
  function handleOk() {
    if (tempHour == null || tempMinute == null) return
    const hh = tempHour.toString().padStart(2, "0")
    const mm = tempMinute.toString().padStart(2, "0")
    const val = `${hh}:${mm} ${tempAmpm}`
    setInternalValue(val)
    setSelectedHour(tempHour)
    setSelectedMinute(tempMinute)
    setAmpm(tempAmpm)
    onChange?.(val)
    setOpen(false)
  }
  function handleCancel() {
    setTempHour(selectedHour)
    setTempMinute(selectedMinute)
    setTempAmpm(ampm)
    setOpen(false)
  }

  // Hiển thị value dạng 12h
  function displayValue() {
    if (internalValue) return internalValue
    return placeholder
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !internalValue && "text-muted-foreground", className)}
        >
          {displayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex max-h-60 overflow-y-auto divide-x divide-gray-200">
          {/* Giờ */}
          <div className="w-1/3 p-2">
            <div className="font-semibold text-center mb-2">Giờ</div>
            <div className="flex flex-col items-center gap-1">
              {hours.map((h) => (
                <Button
                  key={h}
                  variant={tempHour === h ? "default" : "ghost"}
                  size="sm"
                  className="w-12"
                  onClick={() => handleHourSelect(h)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          {/* Phút */}
          <div className="w-1/3 p-2">
            <div className="font-semibold text-center mb-2">Phút</div>
            <div className="flex flex-col items-center gap-1">
              {minutes.map((m) => (
                <Button
                  key={m}
                  variant={tempMinute === m ? "default" : "ghost"}
                  size="sm"
                  className="w-12"
                  onClick={() => handleMinuteSelect(m)}
                >
                  {m.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          {/* AM/PM */}
          <div className="w-1/3 p-2">
            <div className="font-semibold text-center mb-2">AM/PM</div>
            <div className="flex flex-col items-center gap-1">
              {ampmOptions.map((ap) => (
                <Button
                  key={ap}
                  variant={tempAmpm === ap ? "default" : "ghost"}
                  size="sm"
                  className="w-12"
                  onClick={() => handleAmpmSelect(ap)}
                >
                  {ap}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 px-4 py-2 bg-gray-50">
          <Button variant="ghost" size="sm" onClick={handleCancel}>CANCEL</Button>
          <Button variant="default" size="sm" onClick={handleOk} disabled={tempHour == null || tempMinute == null}>OK</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
