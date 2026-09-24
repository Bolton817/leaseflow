import { Prisma } from '@prisma/client';

export function formatCurrency(amount: number | Prisma.Decimal | string, currency: 'USD' | 'KES' = 'USD') {
  const numericAmount = typeof amount === 'number' ? amount : typeof amount === 'string' ? parseFloat(amount) : amount.toNumber();
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
