import prisma from '@/lib/db';
import { TenantStatus } from '@prisma/client';
import { logAuditAction } from './audit';

export async function getTenants(userId: string) {
  return prisma.tenant.findMany({
    where: {
      // The landlord only sees tenants in properties they own
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      unit: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTenantById(userId: string, tenantId: string) {
  return prisma.tenant.findFirst({
    where: {
      id: tenantId,
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      unit: {
        include: {
          property: true,
        },
      },
      invoices: {
        orderBy: { dueDate: 'desc' },
      },
      notifications: {
        orderBy: { sentAt: 'desc' },
        include: {
          invoice: true,
        },
      },
    },
  });
}

export async function createTenant(userId: string, data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  unitId: string;
  leaseStart: Date;
  leaseEnd?: Date;
  status: TenantStatus;
}) {
  // 1. Verify landlord owns the unit
  const unit = await prisma.unit.findFirst({
    where: {
      id: data.unitId,
      property: {
        ownerId: userId,
      },
    },
  });

  if (!unit) {
    throw new Error('Unit not found or unauthorized');
  }

  // 2. Check if the unit already has an ACTIVE tenant
  if (data.status === 'ACTIVE') {
    const activeTenant = await prisma.tenant.findFirst({
      where: {
        unitId: data.unitId,
        status: 'ACTIVE',
      },
    });

    if (activeTenant) {
      throw new Error('This unit already has an active tenant.');
    }
  }

  const tenant = await prisma.tenant.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || '',
      phone: data.phone,
      unitId: data.unitId,
      status: data.status,
      moveInDate: data.leaseStart,
      moveOutDate: data.leaseEnd,
    },
  });

  await logAuditAction({
    userId,
    entityType: 'TENANT',
    entityId: tenant.id,
    action: 'CREATE',
    metadata: { unitId: data.unitId, email: tenant.email },
  });

  return tenant;
}

export async function updateTenantStatus(userId: string, tenantId: string, status: TenantStatus) {
  const tenant = await prisma.tenant.findFirst({
    where: {
      id: tenantId,
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
  });

  if (!tenant) {
    throw new Error('Tenant not found or unauthorized');
  }

  return prisma.tenant.update({
    where: { id: tenantId },
    data: { status },
  });
}

export async function processMoveOut(userId: string, tenantId: string, moveOutDate: Date) {
  const tenant = await prisma.tenant.findFirst({
    where: { id: tenantId, unit: { property: { ownerId: userId } } },
  });

  if (!tenant) throw new Error('Tenant not found or unauthorized');

  return prisma.$transaction(async (tx) => {
    const updatedTenant = await tx.tenant.update({
      where: { id: tenantId },
      data: { status: 'MOVED_OUT', moveOutDate },
    });

    await tx.unit.update({
      where: { id: tenant.unitId },
      data: { status: 'VACANT' },
    });

    return updatedTenant;
  });
}

export async function deleteTenant(userId: string, tenantId: string) {
  const tenant = await prisma.tenant.findFirst({
    where: { id: tenantId, unit: { property: { ownerId: userId } } },
    include: { _count: { select: { invoices: true, payments: true } } }
  });

  if (!tenant) throw new Error('Tenant not found or unauthorized');
  
  if (tenant._count.invoices > 0 || tenant._count.payments > 0) {
    throw new Error('Cannot delete a tenant with existing financial records. Please use the Move Out option instead to preserve history.');
  }

  return prisma.tenant.delete({
    where: { id: tenantId },
  });
}

