'use server';

import { requireSession } from '@/lib/auth/user';
import { createUnit } from '@/lib/domain/units';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const unitSchema = z.object({
  propertyId: z.string().min(1),
  unitNumber: z.string().min(1, 'Unit number is required'),
  monthlyRent: z.coerce.number().positive('Monthly rent must be greater than 0'),
  bedrooms: z.coerce.number().int().nonnegative().optional().or(z.literal('')),
  currency: z.enum(['USD', 'KES']).default('USD'),
});

export async function createUnitAction(prevState: any, formData: FormData) {
  const user = await requireSession();

  const validatedFields = unitSchema.safeParse({
    propertyId: formData.get('propertyId'),
    unitNumber: formData.get('unitNumber'),
    monthlyRent: formData.get('monthlyRent'),
    bedrooms: formData.get('bedrooms'),
    currency: formData.get('currency'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { propertyId, unitNumber, monthlyRent, bedrooms, currency } = validatedFields.data;
  const parsedBedrooms = typeof bedrooms === 'number' ? bedrooms : undefined;

  try {
    await createUnit(user.id, propertyId, {
      unitNumber,
      monthlyRent,
      bedrooms: parsedBedrooms,
      currency,
    });
    
    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create unit' };
  }
}

export async function updateUnitAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const unitId = formData.get('unitId') as string;
  const propertyId = formData.get('propertyId') as string;

  if (!unitId || !propertyId) return { error: 'Missing identifiers' };

  const validatedFields = unitSchema.safeParse({
    propertyId,
    unitNumber: formData.get('unitNumber'),
    monthlyRent: formData.get('monthlyRent'),
    bedrooms: formData.get('bedrooms'),
    currency: formData.get('currency'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { unitNumber, monthlyRent, bedrooms, currency } = validatedFields.data;
  const parsedBedrooms = typeof bedrooms === 'number' ? bedrooms : undefined;

  try {
    const { updateUnit } = await import('@/lib/domain/units');
    await updateUnit(user.id, unitId, {
      unitNumber,
      monthlyRent,
      bedrooms: parsedBedrooms,
      currency,
    });
  } catch (error: any) {
    return { error: error.message || 'Failed to update unit' };
  }

  revalidatePath(`/properties/${propertyId}`);
  return { success: true };
}

export async function deleteUnitAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const unitId = formData.get('unitId') as string;
  const propertyId = formData.get('propertyId') as string;

  if (!unitId) return { error: 'Unit ID is required' };

  try {
    const { safeDeleteUnit } = await import('@/lib/domain/units');
    await safeDeleteUnit(user.id, unitId);
  } catch (error: any) {
    return { error: error.message || 'Failed to delete unit' };
  }

  revalidatePath(`/properties/${propertyId}`);
  return { success: true };
}
