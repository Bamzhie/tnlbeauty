
   interface MonthFilterProps {
     selectedMonth: string | number;
     selectedYear: number;
     onMonthChange: (month: string | number) => void;
     onYearChange: (year: number) => void;
     hideLabels?: boolean;
   }

   export function MonthFilter({ selectedMonth, selectedYear, onMonthChange, onYearChange, hideLabels }: MonthFilterProps) {
     const months = [
       { value: 'all', label: 'All' },
       { value: 0, label: 'January' },
       { value: 1, label: 'February' },
       { value: 2, label: 'March' },
       { value: 3, label: 'April' },
       { value: 4, label: 'May' },
       { value: 5, label: 'June' },
       { value: 6, label: 'July' },
       { value: 7, label: 'August' },
       { value: 8, label: 'September' },
       { value: 9, label: 'October' },
       { value: 10, label: 'November' },
       { value: 11, label: 'December' },
     ];

     const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

     return (
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex space-x-4">
         <div>
           {!hideLabels && <label className="text-sm text-gray-600 mb-1 block">Month</label>}
           <select
             value={selectedMonth}
             onChange={(e) => onMonthChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
             className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             {months.map((month) => (
               <option key={month.value} value={month.value}>{month.label}</option>
             ))}
           </select>
         </div>
         <div>
           {!hideLabels && <label className="text-sm text-gray-600 mb-1 block">Year</label>}
           <select
             value={selectedYear}
             onChange={(e) => onYearChange(Number(e.target.value))}
             className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             {years.map((year) => (
               <option key={year} value={year}>{year}</option>
             ))}
           </select>
         </div>
       </div>
     );
   }