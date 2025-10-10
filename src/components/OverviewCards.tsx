import { Card, CardContent } from "@/components/ui/card";

interface OverviewCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totalIncome,
  totalExpenses,
  balance,
  showAnalytics,
  onToggleAnalytics,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Card className="shadow-lg border-0 bg-green-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-green-700">Income</div>
          <div className="text-lg font-bold text-green-900">
            £{totalIncome.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-red-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-red-700">Expenses</div>
          <div className="text-lg font-bold text-red-900">
            £{totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-blue-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-blue-700">Net Balance</div>
          <div className="text-lg font-bold text-blue-900">
            £{balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card 
        className="shadow-lg border-0 bg-yellow-50 hover:bg-yellow-100 cursor-pointer" 
        onClick={onToggleAnalytics}
      >
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-yellow-700">Analytics</div>
          <div className="text-lg font-bold text-yellow-900">
            {showAnalytics ? "Hide" : "View"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};