import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateRangeSelectorProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeSelectorProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Date Range</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="[color-scheme:light] dark:text-white"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="[color-scheme:light] dark:text-white"
          />
        </div>
      </div>
    </section>
  )
} 