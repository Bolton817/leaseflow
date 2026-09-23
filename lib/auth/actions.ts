'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid email or password',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return { error: 'Invalid email or password' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return { error: 'Invalid email or password' };
    }

    await createSession(user.id);
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  redirect('/dashboard');
}

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export async function registerAction(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'An account with this email already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    await createSession(user.id);
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}
