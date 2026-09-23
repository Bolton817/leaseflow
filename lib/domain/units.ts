import prisma from '@/lib/db';
import { UnitStatus } from '@prisma/client';

export async function createUnit(userId: string, propertyId: string, data: { unitNumber: string; monthlyRent: number; bedrooms?: number }) {
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
    },
  });
}

export async function updateUnit(userId: string, unitId: string, data: Partial<{ unitNumber: string; monthlyRent: number; bedrooms: number; status: UnitStatus }>) {
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
