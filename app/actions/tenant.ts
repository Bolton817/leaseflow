'use server';

import { requireSession } from '@/lib/auth/user';
import { createTenant } from '@/lib/domain/tenants';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { TenantStatus } from '@prisma/client';

const tenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  unitId: z.string().min(1, 'Unit is required'),
  leaseStart: z.string().min(1, 'Lease start date is required'),
  leaseEnd: z.string().optional().or(z.literal('')),
});

export async function createTenantAction(prevState: any, formData: FormData) {
  const user = await requireSession();

  const validatedFields = tenantSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    unitId: formData.get('unitId'),
    leaseStart: formData.get('leaseStart'),
    leaseEnd: formData.get('leaseEnd'),
  });

  if (!validatedFields.success) {
    return { error: 'Please check your inputs: ' + validatedFields.error.issues[0].message };
  }

  const { firstName, lastName, email, phone, unitId, leaseStart, leaseEnd } = validatedFields.data;

  let newTenantId: string;
  try {
    const tenant = await createTenant(user.id, {
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      unitId,
      leaseStart: new Date(leaseStart),
      leaseEnd: leaseEnd ? new Date(leaseEnd) : undefined,
      status: 'ACTIVE', // Automatically ACTIVE on creation
    });
    newTenantId = tenant.id;
  } catch (error: any) {
    return { error: error.message || 'Failed to create tenant' };
  }

  revalidatePath('/tenants');
  redirect(`/tenants/${newTenantId}`);
}
