// New component: components/ClientRetentionCards.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClientRetentionCardsProps {
  retentionRate: string;
  averageDays: string;
}

export const ClientRetentionCards: React.FC<ClientRetentionCardsProps> = ({ retentionRate, averageDays }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Card className="shadow-lg border-0 bg-purple-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-purple-700">Client Retention Rate</div>
          <div className="text-lg font-bold text-purple-900">{retentionRate}%</div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-0 bg-indigo-50">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-indigo-700">Avg Days Between Visits</div>
          <div className="text-lg font-bold text-indigo-900">{averageDays} days</div>
        </CardContent>
      </Card>
    </div>
  );
};