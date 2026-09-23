'use server';

import { requireSession } from '@/lib/auth/user';
import { generateMonthlyInvoices } from '@/lib/domain/invoices';
import { revalidatePath } from 'next/cache';

export async function generateInvoicesAction() {
  const user = await requireSession();

  try {
    const result = await generateMonthlyInvoices(user.id);
    revalidatePath('/invoices');
    revalidatePath('/dashboard');
    return { success: true, count: result.generatedCount, period: result.billingPeriod };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate invoices' };
  }
}
