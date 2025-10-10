// New component: components/PredictiveCards.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PredictiveCardsProps {
  forecastedIncome: string;
  predictedBookings: number;
}

export const PredictiveCards: React.FC<PredictiveCardsProps> = ({ forecastedIncome, predictedBookings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Card className="shadow-lg border-0 bg-teal-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-teal-700">Forecasted Income (Next Month)</div>
          <div className="text-lg font-bold text-teal-900">£{forecastedIncome}</div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-cyan-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-cyan-700">Predicted Bookings (Next Month)</div>
          <div className="text-lg font-bold text-cyan-900">{predictedBookings}</div>
        </CardContent>
      </Card>
    </div>
  );
};