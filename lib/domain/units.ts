import prisma from '@/lib/db';
import { UnitStatus, Currency } from '@prisma/client';

export async function createUnit(userId: string, propertyId: string, data: { unitNumber: string; monthlyRent: number; bedrooms?: number; currency?: Currency }) {
  // First ensure ownership of property
  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: userId },
  });

  if (!property) {
    throw new Error('Property not found or unauthorized');
  }

  // Check for uniqueness within property
  const existingUnit = await prisma.unit.findUnique({
    where: {
      propertyId_unitNumber: {
        propertyId,
        unitNumber: data.unitNumber,
      },
    },
  });

  if (existingUnit) {
    throw new Error('Unit number already exists in this property');
  }

  return prisma.unit.create({
    data: {
      propertyId,
      unitNumber: data.unitNumber,
      monthlyRent: data.monthlyRent,
      bedrooms: data.bedrooms,
      currency: data.currency || 'USD',
    },
  });
}

export async function updateUnit(userId: string, unitId: string, data: Partial<{ unitNumber: string; monthlyRent: number; bedrooms: number; status: UnitStatus; currency: Currency }>) {
  // Verify ownership via property
  const unit = await prisma.unit.findFirst({
    where: { id: unitId },
    include: { property: true },
  });

  if (!unit || unit.property.ownerId !== userId) {
    throw new Error('Unit not found or unauthorized');
  }

  // If changing unit number, ensure uniqueness
  if (data.unitNumber && data.unitNumber !== unit.unitNumber) {
    const existingUnit = await prisma.unit.findUnique({
      where: {
        propertyId_unitNumber: {
          propertyId: unit.propertyId,
          unitNumber: data.unitNumber,
        },
      },
    });

    if (existingUnit) {
      throw new Error('Unit number already exists in this property');
    }
  }

  return prisma.unit.update({
    where: { id: unitId },
    data,
  });
}

export async function safeDeleteUnit(userId: string, unitId: string) {
  const unit = await prisma.unit.findFirst({
    where: { id: unitId, property: { ownerId: userId } },
    include: {
      _count: { select: { tenants: true, invoices: true, payments: true } }
    }
  });

  if (!unit) throw new Error('Unit not found or unauthorized');

  if (unit._count.tenants > 0 || unit._count.invoices > 0 || unit._count.payments > 0) {
    // Soft delete
    return prisma.unit.update({
      where: { id: unitId },
      data: { status: 'INACTIVE' }
    });
  } else {
    // Hard delete
    return prisma.unit.delete({
      where: { id: unitId }
    });
  }
}
