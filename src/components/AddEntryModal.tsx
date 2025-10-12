import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialStep?: 'choose' | 'income' | 'expense';
  initialClientName?: string; // Added prop for pre-populating client name
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onSubmit, initialStep = 'choose', initialClientName = '' }) => {
  const [step, setStep] = useState<'choose' | 'income' | 'expense'>(initialStep);
  const [formData, setFormData] = useState({
    name: initialClientName,
    service: '',
    customService: '',
    category: 'Supplies',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // Update step and formData when initial props change
  useEffect(() => {
    setStep(initialStep);
    setFormData(prev => ({
      ...prev,
      name: initialClientName,
    }));
  }, [initialStep, initialClientName]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (step === 'income') {
      if (!formData.name.trim()) {
        alert('Client name is required');
        return;
      }
      if (!formData.service) {
        alert('Service is required');
        return;
      }
      if (!formData.amount || Number(formData.amount) <= 0) {
        alert('Valid amount is required');
        return;
      }
    } else if (step === 'expense') {
      if (!formData.amount || Number(formData.amount) <= 0) {
        alert('Valid amount is required');
        return;
      }
    }

    onSubmit({
      type: step,
      ...formData,
      service: formData.service === 'Other' ? formData.customService : formData.service,
    });

    // Reset form, keeping client name if provided
    setFormData({
      name: initialClientName,
      service: '',
      customService: '',
      category: 'Supplies',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
    });
    setStep('choose');
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: initialClientName,
      service: '',
      customService: '',
      category: 'Supplies',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
    });
    setStep('choose');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 rounded-t-3xl sm:rounded-t-xl">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {step === 'choose' && 'Add New Entry'}
            {step === 'income' && 'Add Income'}
            {step === 'expense' && 'Add Expense'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pb-6">
          {step === 'choose' && (
            <div className="space-y-3">
              <button
                onClick={() => setStep('income')}
                className="w-full p-5 bg-green-50 hover:bg-green-100 active:bg-green-100 border-2 border-green-200 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-green-900 text-lg">Add Income</p>
                    <p className="text-sm text-green-600 mt-0.5">Record client payment</p>
                  </div>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => setStep('expense')}
                className="w-full p-5 bg-red-50 hover:bg-red-100 active:bg-red-100 border-2 border-red-200 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-red-900 text-lg">Add Expense</p>
                    <p className="text-sm text-red-600 mt-0.5">Record business expense</p>
                  </div>
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {step === 'income' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter client name"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!!initialClientName} // Disable if client name is pre-populated
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                >
                  <option value="">Select service</option>
                  <option value="Gel nails">Gel nails</option>
                  <option value="Acrylic nails">Acrylic nails</option>
                  <option value="Waxing">Waxing</option>
                  <option value="Hair">Hair</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.service === 'Other' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Service *
                  </label>
                  <input
                    type="text"
                    value={formData.customService}
                    onChange={(e) => setFormData({ ...formData, customService: e.target.value })}
                    placeholder="Enter custom service"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (£) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 active:scale-98 transition-all font-semibold shadow-md"
                >
                  Add Income
                </button>
              </div>
            </div>
          )}

          {step === 'expense' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                >
                  <option value="Supplies">Supplies</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (£) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('choose')}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 active:scale-98 transition-all font-semibold shadow-md"
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        @media (min-width: 640px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};