/**
 * Currency and price formatting utilities for Indian Rupee (INR)
 */

export const formatCurrency = (
  amount: number | null | undefined,
  fallback = 'Contact for price'
): string => {
  if (amount === 0) return 'FREE';
  if (amount === null || amount === undefined || isNaN(amount)) return fallback;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPriceShort = (amount: number | null | undefined): string => {
  if (amount === 0) return 'FREE';
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  return `₹${amount.toLocaleString('en-IN')}`;
};
