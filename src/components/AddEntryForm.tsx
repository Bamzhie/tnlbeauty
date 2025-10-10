import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddEntryFormProps {
  txType: 'income' | 'expense';
  formName: string;
  formService: string;
  formCustomService: string;
  formCategory: string;
  formAmount: string;
  formDate: string;
  customService: string;
  onTxTypeChange: (type: 'income' | 'expense') => void;
  onFormNameChange: (name: string) => void;
  onFormServiceChange: (service: string) => void;
  onFormCustomServiceChange: (service: string) => void;
  onFormCategoryChange: (category: string) => void;
  onFormAmountChange: (amount: string) => void;
  onFormDateChange: (date: string) => void;
  onCustomServiceChange: (service: string) => void;
  onSubmit: () => void;
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
  txType,
  formName,
  formService,
  formCustomService,
  formCategory,
  formAmount,
  formDate,
  customService,
  onTxTypeChange,
  onFormNameChange,
  onFormServiceChange,
  onFormCustomServiceChange,
  onFormCategoryChange,
  onFormAmountChange,
  onFormDateChange,
  onCustomServiceChange,
  onSubmit,
}) => {
  return (
    <Card className="mb-4 sm:mb-8 shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-900 text-base sm:text-lg">Add New Entry</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="txType" className="text-sm font-medium text-gray-700">
              Entry Type
            </Label>
            <Select value={txType} onValueChange={(value) => onTxTypeChange(value as 'income' | 'expense')}>
              <SelectTrigger id="txType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {txType === 'income' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  value={formName}
                  onChange={e => onFormNameChange(e.target.value)}
                  placeholder="Enter client name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-medium text-gray-700">
                  Service
                </Label>
                <Select 
                  value={formService}
                  onValueChange={(value) => {
                    onFormServiceChange(value);
                    onCustomServiceChange(value);
                  }}
                >
                  <SelectTrigger id="service" className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gel nails">Gel nails</SelectItem>
                    <SelectItem value="Acrylic nails">Acrylic nails</SelectItem>
                    <SelectItem value="Waxing">Waxing</SelectItem>
                    <SelectItem value="Hair">Hair</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {customService === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="customService" className="text-sm font-medium text-gray-700">
                    Custom Service
                  </Label>
                  <Input
                    id="customService"
                    value={formCustomService}
                    onChange={e => onFormCustomServiceChange(e.target.value)}
                    placeholder="Enter custom service name"
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}

          {txType === 'expense' && (
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select 
                value={formCategory}
                onValueChange={onFormCategoryChange}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount (£)
            </Label>
            <Input
              id="amount"
              value={formAmount}
              onChange={e => onFormAmountChange(e.target.value)}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <Input
              id="date"
              value={formDate}
              onChange={e => onFormDateChange(e.target.value)}
              type="date"
              className="w-full"
            />
          </div>

          <Button 
            onClick={onSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            size="lg"
          >
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};