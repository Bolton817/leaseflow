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

export async function processMoveOutAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const tenantId = formData.get('tenantId') as string;
  const moveOutDate = formData.get('moveOutDate') as string;

  if (!tenantId || !moveOutDate) return { error: 'Tenant ID and Move Out Date are required.' };

  try {
    const { processMoveOut } = await import('@/lib/domain/tenants');
    await processMoveOut(user.id, tenantId, new Date(moveOutDate));
  } catch (error: any) {
    return { error: error.message || 'Failed to process move out' };
  }

  revalidatePath(`/tenants/${tenantId}`);
  revalidatePath('/tenants');
  return { success: true };
}

export async function deleteTenantAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const tenantId = formData.get('tenantId') as string;

  if (!tenantId) return { error: 'Tenant ID is required.' };

  try {
    const { deleteTenant } = await import('@/lib/domain/tenants');
    await deleteTenant(user.id, tenantId);
  } catch (error: any) {
    return { error: error.message || 'Failed to delete tenant' };
  }

  revalidatePath('/tenants');
  redirect('/tenants');
}

export async function updateTenantAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const tenantId = formData.get('tenantId') as string;
  
  if (!tenantId) return { error: 'Tenant ID is required.' };

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

  const data = validatedFields.data;

  try {
    const prisma = (await import('@/lib/db')).default;
    // Verify auth
    const existing = await prisma.tenant.findFirst({
      where: { id: tenantId, unit: { property: { ownerId: user.id } } }
    });
    if (!existing) throw new Error('Unauthorized');

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || '',
        phone: data.phone || null,
        unitId: data.unitId,
        moveInDate: new Date(data.leaseStart),
        moveOutDate: data.leaseEnd ? new Date(data.leaseEnd) : null,
      }
    });
  } catch (error: any) {
    return { error: error.message || 'Failed to update tenant' };
  }

  revalidatePath(`/tenants/${tenantId}`);
  revalidatePath('/tenants');
  return { success: true };
}
