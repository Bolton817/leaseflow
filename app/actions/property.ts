'use server';

import { requireSession } from '@/lib/auth/user';
import { createProperty, updateProperty, deactivateProperty } from '@/lib/domain/properties';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  description: z.string().optional(),
});

export async function createPropertyAction(prevState: any, formData: FormData) {
  const user = await requireSession();

  const validatedFields = propertySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    description: formData.get('description') || undefined,
  });

  if (!validatedFields.success) {
    return { error: 'Please check your inputs' };
  }

  let newPropertyId: string;
  try {
    const newProperty = await createProperty(user.id, validatedFields.data);
    newPropertyId = newProperty.id;
  } catch (error) {
    return { error: 'Failed to create property' };
  }

  revalidatePath('/properties');
  redirect(`/properties/${newPropertyId}`);
}
