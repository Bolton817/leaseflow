import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/session';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return null;
  }

  const payload = await decrypt(session);

  if (!payload || !payload.userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireSession() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}
