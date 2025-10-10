import { Card, CardContent } from "@/components/ui/card";

interface ClientCounterProps {
  count: number;
  selectedMonth: string | number;
  showClientList: boolean;
  onToggle: () => void;
}

export const ClientCounter: React.FC<ClientCounterProps> = ({
  count,
  selectedMonth,
  showClientList,
  onToggle,
}) => {
  const monthLabel =
    selectedMonth === "all"
      ? "All Months"
      : new Date(0, selectedMonth as number).toLocaleString("default", {
          month: "long",
        });

  return (
    <Card
      className="mb-4 sm:mb-6 shadow-lg border-0 cursor-pointer"
      onClick={onToggle}
    >
      <CardContent className="pt-6 text-center">
        <div className="text-sm text-gray-700">
          Total Clients ({monthLabel})
        </div>
        <div className="text-xl font-semibold text-blue-900">{count}</div>
        <div className="text-sm text-blue-600 underline">
          {showClientList ? "Hide List" : "View Clients"}
        </div>
      </CardContent>
    </Card>
  );
};
