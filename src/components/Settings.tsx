import React, { useState } from 'react';
import { AnalyticsSection } from './AnalyticsSection';
import { Button } from '@/components/ui/button';
import { Moon, Sun, X } from 'lucide-react';
import api from '../service/api';
import { Toaster, toast } from 'react-hot-toast';

interface SettingsProps {
  totalIncome: number;
  totalExpenses: number;
  pieData: { name: string; value: number }[];
  serviceData: { service: string; count: number }[];
  retentionRate: string;
  averageDays: string;
  forecastedIncome: string;
  predictedBookings: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Settings({
  totalIncome,
  totalExpenses,
  pieData,
  serviceData,
  retentionRate,
  averageDays,
  forecastedIncome,
  predictedBookings,
  isDarkMode,
  toggleDarkMode,
}: SettingsProps) {
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

  const handleClearData = async () => {
    try {
      await api.resetDatabase();
      toast.success('Data cleared successfully.', {
        style: {
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data.', {
        style: {
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
      });
    } finally {
      setIsClearDataModalOpen(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics</h2>
          <AnalyticsSection
            show={true}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            pieData={pieData}
            serviceData={serviceData}
            retentionRate={retentionRate}
            averageDays={averageDays}
            forecastedIncome={forecastedIncome}
            predictedBookings={predictedBookings}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
          <Button
            variant="destructive"
            onClick={() => setIsClearDataModalOpen(true)}
            className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white"
          >
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Clear Data
              </h3>
              <button
                onClick={() => setIsClearDataModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to clear all data? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsClearDataModalOpen(false)}
                className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearData}
                className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}