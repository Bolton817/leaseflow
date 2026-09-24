import prisma from '@/lib/db';
import { InvoiceStatus } from '@prisma/client';
import { sendNotification } from './notifications';
import { logAuditAction } from './audit';

export async function getInvoices(userId: string) {
  return prisma.invoice.findMany({
    where: {
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      tenant: true,
      unit: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      dueDate: 'desc',
    },
  });
}

export async function getInvoiceById(userId: string, invoiceId: string) {
  return prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      tenant: true,
      unit: {
        include: {
          property: true,
        },
      },
      payments: {
        orderBy: { paymentDate: 'desc' },
      },
    },
  });
}

export async function generateMonthlyInvoices(userId: string) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  // Ensure month is 2 digits
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const billingPeriod = `${year}-${month}`; // e.g., "2026-09"

  // Due date is typically the 5th of the current month
  const dueDate = new Date(year, currentDate.getMonth(), 5);

  // 1. Find all ACTIVE tenants for this landlord
  const activeTenants = await prisma.tenant.findMany({
    where: {
      status: 'ACTIVE',
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      unit: true,
    },
  });

  let generatedCount = 0;

  // 2. Loop through and create invoices if they don't exist for this period
  for (const tenant of activeTenants) {
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        tenantId: tenant.id,
        billingPeriod,
      },
    });

    if (!existingInvoice) {
      // Generate a unique invoice number (e.g. INV-2026-09-[UNIT])
      const invoiceNumber = `INV-${billingPeriod}-${tenant.unit.unitNumber}-${Math.floor(Math.random() * 1000)}`;

      const invoice = await prisma.invoice.create({
        data: {
          tenantId: tenant.id,
          unitId: tenant.unitId,
          currency: tenant.unit.currency,
          invoiceNumber,
          billingPeriod,
          amount: tenant.unit.monthlyRent,
          dueDate,
          status: 'ISSUED',
          issuedAt: new Date(),
        },
      });

      // Send mock notification
      await sendNotification({
        tenantId: tenant.id,
        type: 'INVOICE_ISSUED',
        channel: 'EMAIL',
        invoiceId: invoice.id,
        metadata: {
          billingPeriod,
          amount: tenant.unit.monthlyRent,
          dueDate: dueDate.toLocaleDateString(),
        },
      });

      generatedCount++;
    }
  }

  if (generatedCount > 0) {
    await logAuditAction({
      userId,
      entityType: 'INVOICE_BATCH',
      entityId: billingPeriod,
      action: 'GENERATE',
      metadata: { count: generatedCount, billingPeriod },
    });
  }

  return { generatedCount, billingPeriod };
}
