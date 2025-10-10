import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent,  } from '@/components/ui/card';

interface MonthFilterProps {
  selectedMonth: string | number;
  selectedYear: number;
  onMonthChange: (month: string | number) => void;
  onYearChange: (year: number) => void;
}

export const MonthFilter: React.FC<MonthFilterProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  return (
    <Card className="mb-4 sm:mb-6 shadow-lg border-0">
      <CardContent className="pt-6 flex justify-center gap-2 flex-wrap">
        <div className="space-y-2 w-full sm:w-auto">
          <Label htmlFor="month" className="text-sm font-medium text-gray-700">
            Month
          </Label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => onMonthChange(value === 'all' ? 'all' : Number(value))}
          >
            <SelectTrigger id="month" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium text-gray-700">
            Year
          </Label>
          <Input
            id="year"
            type="number"
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-24 text-center"
          />
        </div>
      </CardContent>
    </Card>
  );
};