'use server';

import { requireSession } from '@/lib/auth/user';
import { recordPayment } from '@/lib/domain/payments';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  amount: z.coerce.number().positive('Amount must be strictly positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  referenceNumber: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export async function recordPaymentAction(prevState: any, formData: FormData) {
  const user = await requireSession();

  const validatedFields = paymentSchema.safeParse({
    invoiceId: formData.get('invoiceId')?.toString(),
    amount: formData.get('amount'),
    paymentMethod: formData.get('paymentMethod')?.toString(),
    paymentDate: formData.get('paymentDate')?.toString(),
    referenceNumber: formData.get('referenceNumber')?.toString() || '',
    notes: formData.get('notes')?.toString() || '',
  });

  if (!validatedFields.success) {
    return { error: 'Please check your inputs: ' + (validatedFields.error?.issues?.[0]?.message || 'Invalid form data') };
  }

  const { invoiceId, amount, paymentMethod, paymentDate, referenceNumber, notes } = validatedFields.data;

  try {
    await recordPayment(user.id, {
      invoiceId,
      amount,
      paymentMethod,
      paymentDate: new Date(paymentDate),
      referenceNumber: referenceNumber || undefined,
      notes: notes || undefined,
    });
    
    // Refresh the invoice details page and the global payments ledger
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath('/financials');
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to record payment' };
  }
}
