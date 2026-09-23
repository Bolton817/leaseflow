'use server';

import { requireSession } from '@/lib/auth/user';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['PROPERTY_MANAGER', 'SYSTEM_ADMIN']),
  avatarUrl: z.string().optional().or(z.literal('')),
});

export async function updateProfileAction(formData: FormData) {
  const user = await requireSession();
  
  const rawData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    avatarUrl: formData.get('avatarUrl') as string,
  };
  
  const parsed = updateProfileSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        role: parsed.data.role,
        avatarUrl: parsed.data.avatarUrl || null,
      }
    });
    
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update profile. Email might be in use.' };
  }
}
