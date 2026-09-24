'use server';

import { requireSession } from '@/lib/auth/user';
import { createProperty, updateProperty, deactivateProperty } from '@/lib/domain/properties';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { supabaseAdmin } from '@/lib/utils/supabase';

const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  description: z.string().optional(),
});

async function handleImageUpload(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  const { error } = await supabaseAdmin.storage
    .from('properties')
    .upload(fileName, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error("Supabase Storage Error:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
  
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('properties')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}

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
    const imageFile = formData.get('image') as File | null;
    const imageUrl = await handleImageUpload(imageFile);

    const newProperty = await createProperty(user.id, {
      ...validatedFields.data,
      imageUrl
    });
    newPropertyId = newProperty.id;
  } catch (error: any) {
    return { error: error.message || 'Failed to create property' };
  }

  revalidatePath('/properties');
  redirect(`/properties/${newPropertyId}`);
}

export async function updatePropertyAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const propertyId = formData.get('propertyId') as string;

  if (!propertyId) return { error: 'Property ID is required' };

  const validatedFields = propertySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    description: formData.get('description') || undefined,
  });

  if (!validatedFields.success) {
    return { error: 'Please check your inputs' };
  }

  try {
    const imageFile = formData.get('image') as File | null;
    const imageUrl = await handleImageUpload(imageFile);
    
    const updateData: any = { ...validatedFields.data };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const { updateProperty } = await import('@/lib/domain/properties');
    await updateProperty(user.id, propertyId, updateData);
  } catch (error: any) {
    return { error: error.message || 'Failed to update property' };
  }

  revalidatePath(`/properties/${propertyId}`);
  revalidatePath('/properties');
  return { success: true };
}

export async function deletePropertyAction(prevState: any, formData: FormData) {
  const user = await requireSession();
  const propertyId = formData.get('propertyId') as string;

  if (!propertyId) return { error: 'Property ID is required' };

  try {
    const { safeDeleteProperty } = await import('@/lib/domain/properties');
    await safeDeleteProperty(user.id, propertyId);
  } catch (error: any) {
    return { error: error.message || 'Failed to delete property' };
  }

  revalidatePath('/properties');
  redirect('/properties');
}
