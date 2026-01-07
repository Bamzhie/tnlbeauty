interface FilterProps {
  selectedMonth?: string | number;
  selectedYear?: number;
  onMonthChange?: (month: string | number) => void;
  onYearChange?: (year: number) => void;
  showMonth?: boolean;
  showYear?: boolean;
  className?: string;
}

export function Filter({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  showMonth = true,
  showYear = true,
  className = "",
}: FilterProps) {
  const months = [
    { value: "all", label: "All" },
    { value: 0, label: "Jan" },
    { value: 1, label: "Feb" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Apr" },
    { value: 4, label: "May" },
    { value: 5, label: "Jun" },
    { value: 6, label: "Jul" },
    { value: 7, label: "Aug" },
    { value: 8, label: "Sep" },
    { value: 9, label: "Oct" },
    { value: 10, label: "Nov" },
    { value: 11, label: "Dec" },
  ];

  const years = Array.from({ length: 2030 - 2025 + 1 }, (_, i) => 2025 + i);

  return (
    <div className={`flex gap-2 ${className}`}>
      {showMonth && onMonthChange && (
        <select
          value={selectedMonth}
          onChange={(e) =>
            onMonthChange(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      )}
      {showYear && onYearChange && (
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
