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
});

export async function createUnitAction(prevState: any, formData: FormData) {
  const user = await requireSession();

  const validatedFields = unitSchema.safeParse({
    propertyId: formData.get('propertyId'),
    unitNumber: formData.get('unitNumber'),
    monthlyRent: formData.get('monthlyRent'),
    bedrooms: formData.get('bedrooms'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { propertyId, unitNumber, monthlyRent, bedrooms } = validatedFields.data;
  const parsedBedrooms = typeof bedrooms === 'number' ? bedrooms : undefined;

  try {
    await createUnit(user.id, propertyId, {
      unitNumber,
      monthlyRent,
      bedrooms: parsedBedrooms,
    });
    
    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create unit' };
  }
}
