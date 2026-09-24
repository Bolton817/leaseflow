import prisma from '@/lib/db';
import { Property } from '@prisma/client';
import { logAuditAction } from './audit';

export async function getProperties(userId: string) {
  return prisma.property.findMany({
    where: {
      ownerId: userId,
      isActive: true,
    },
    include: {
      _count: {
        select: { units: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPropertyById(userId: string, propertyId: string) {
  return prisma.property.findFirst({
    where: {
      id: propertyId,
      ownerId: userId,
      isActive: true,
    },
    include: {
      units: {
        orderBy: {
          unitNumber: 'asc',
        },
      },
    },
  });
}

export async function createProperty(userId: string, data: { name: string; address: string; city: string; description?: string; imageUrl?: string }) {
  const property = await prisma.property.create({
    data: {
      ownerId: userId,
      name: data.name,
      address: data.address,
      city: data.city,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  });

  await logAuditAction({
    userId,
    entityType: 'PROPERTY',
    entityId: property.id,
    action: 'CREATE',
    metadata: { name: property.name, city: property.city },
  });

  return property;
}

export async function updateProperty(userId: string, propertyId: string, data: Partial<{ name: string; address: string; city: string; description: string; imageUrl: string }>) {
  // First ensure ownership
  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: userId },
  });

  if (!property) {
    throw new Error('Property not found or unauthorized');
  }

  return prisma.property.update({
    where: { id: propertyId },
    data,
  });
}

export async function deactivateProperty(userId: string, propertyId: string) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: userId },
  });

  if (!property) {
    throw new Error('Property not found or unauthorized');
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: { isActive: false },
  });
}

export async function safeDeleteProperty(userId: string, propertyId: string) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: userId },
    include: {
      units: {
        include: {
          _count: { select: { tenants: true, invoices: true, payments: true } }
        }
      }
    }
  });

  if (!property) throw new Error('Property not found or unauthorized');

  let hasHistory = false;
  for (const unit of property.units) {
    if (unit._count.tenants > 0 || unit._count.invoices > 0 || unit._count.payments > 0) {
      hasHistory = true;
      break;
    }
  }

  if (hasHistory) {
    // Soft delete
    return prisma.property.update({
      where: { id: propertyId },
      data: { isActive: false }
    });
  } else {
    // Hard delete
    return prisma.$transaction(async (tx) => {
      // Delete units first
      if (property.units.length > 0) {
        await tx.unit.deleteMany({ where: { propertyId } });
      }
      return tx.property.delete({ where: { id: propertyId } });
    });
  }
}
