import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Visit {
  id: string;
  visitId: string;
  date: string;
  service: string;
  amount: number;
}

interface EditVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (visitId: string, service: string, amount: number) => Promise<void>;
  visit: Visit | null;
}

export const EditVisitModal: React.FC<EditVisitModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  visit 
}) => {
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && visit) {
      const serviceOptions = ['Gel-x', 'Acrylic', 'Biab', 'Pedicure', 'Gel Manicure'];
      if (serviceOptions.includes(visit.service)) {
        setService(visit.service);
        setCustomService('');
      } else {
        setService('Other');
        setCustomService(visit.service);
      }
      setAmount(visit.amount.toString());
      setIsSubmitting(false);
    }
  }, [isOpen, visit]);

  if (!isOpen || !visit) return null;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!service) {
      toast.error('Service is required');
      return;
    }

    if (service === 'Other' && !customService.trim()) {
      toast.error('Custom service is required');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Valid amount is required');
      return;
    }

    const finalService = service === 'Other' ? customService.trim() : service;
    const finalAmount = Number(amount);

    if (finalService === visit.service && finalAmount === visit.amount) {
      toast.error('No changes made');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(visit.visitId, finalService, finalAmount);
      toast.success('Visit updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-xl shadow-2xl w-full sm:max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Edit Visit
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visit Date: <span className="font-medium text-gray-900 dark:text-white">
                {new Date(visit.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Service *
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 dark:text-white"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' fill='%23D1D5DB' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              disabled={isSubmitting}
            >
              <option value="">Select service</option>
              <option value="Gel-x">Gel-x</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Biab">Biab</option>
              <option value="Pedicure">Pedicure</option>
              <option value="Gel Manicure">Gel Manicure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {service === 'Other' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Custom Service *
              </label>
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Enter custom service"
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Amount (£) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
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