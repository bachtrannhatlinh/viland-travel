"use client"

import * as React from "react"
import { format, parseISO, isValid, startOfDay, endOfDay } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  min?: string
  max?: string
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return format(date, "dd/MM/yyyy", { locale: vi })
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled = false,
  min,
  max,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [month, setMonth] = React.useState<Date | undefined>(undefined)

  const minDate = React.useMemo(() => (min ? startOfDay(parseISO(min)) : undefined), [min])
  const maxDate = React.useMemo(() => (max ? endOfDay(parseISO(max)) : undefined), [max])

  // Set a very wide range to allow selecting years from 1900 to 2125
  const effectiveMinDate = React.useMemo(() => {
    if (minDate) return minDate
    // Allow selecting from 1900 for better UX
    return new Date(1900, 0, 1)
  }, [minDate])

  const effectiveMaxDate = React.useMemo(() => {
    if (maxDate) return maxDate
    // Allow selecting up to 2125 for better UX
    return new Date(2125, 11, 31)
  }, [maxDate])

  const defaultMonth = React.useMemo(() => {
    if (date) return date
    // Hiển thị mặc định tháng 1 năm 1997 nếu chưa chọn ngày
    return new Date(1997, 0, 1)
  }, [date])

  const disabledMatchers = React.useMemo(() => {
    const rules: any[] = []
    if (effectiveMinDate) rules.push({ before: effectiveMinDate })
    if (effectiveMaxDate) rules.push({ after: effectiveMaxDate })
    return rules.length ? rules : undefined
  }, [effectiveMinDate, effectiveMaxDate])

  // Custom formatters for better year range
  const formatters = React.useMemo(() => ({
    formatYear: (date: Date) => date.getFullYear().toString(),
    formatMonthDropdown: (date: Date) => date.toLocaleString("vi", { month: "long" }),
  }), [])

  React.useEffect(() => {
    if (value) {
      try {
        const parsedDate = parseISO(value)
        if (isValid(parsedDate)) {
          setDate(parsedDate)
          setMonth(parsedDate)
        }
      } catch (error) {
        console.error('Error parsing date:', error)
      }
    } else {
      setDate(undefined)
      setMonth(undefined)
    }
  }, [value])

  React.useEffect(() => {
    if (open) {
      const initialMonth = date ?? defaultMonth ?? new Date()
      setMonth(initialMonth)
    }
  }, [open, date, defaultMonth])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      const isoDate = format(selectedDate, "yyyy-MM-dd")
      onChange(isoDate)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Input
        value={date ? formatDate(date) : ""}
        placeholder={placeholder}
        className={cn("bg-background pr-10", className)}
        readOnly
        disabled={disabled}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 border-0"
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            <span className="sr-only">Chọn ngày</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            fromDate={effectiveMinDate}
            toDate={effectiveMaxDate}
            defaultMonth={defaultMonth}
            captionLayout="dropdown"
            disabled={disabledMatchers}
            month={month}
            onMonthChange={setMonth}
            formatters={formatters}
            showOutsideDays={false}
            fromYear={1900}
            toYear={2125}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
