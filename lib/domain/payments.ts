import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { sendNotification } from './notifications';
import { logAuditAction } from './audit';

export async function getPayments(userId: string) {
  return prisma.payment.findMany({
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
      invoice: true,
    },
    orderBy: {
      paymentDate: 'desc',
    },
  });
}

export async function recordPayment(userId: string, data: {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  referenceNumber?: string;
  notes?: string;
}) {
  // 1. Verify ownership and fetch invoice with existing payments
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: data.invoiceId,
      unit: {
        property: {
          ownerId: userId,
        },
      },
    },
    include: {
      payments: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found or unauthorized');
  }

  // 2. Calculate current paid amount
  const currentPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalAmount = Number(invoice.amount);
  const remainingBalance = totalAmount - currentPaid;

  // 3. Verify overpayment constraint
  if (data.amount > remainingBalance) {
    throw new Error(`Payment amount (${data.amount} ${invoice.currency}) exceeds remaining balance (${remainingBalance} ${invoice.currency})`);
  }

  // 4. Use a transaction to record payment and update invoice status
  return prisma.$transaction(async (tx) => {
    // Create the payment record
    const payment = await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        tenantId: invoice.tenantId,
        unitId: invoice.unitId,
        currency: invoice.currency,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        referenceNumber: data.referenceNumber,
        notes: data.notes,
      },
    });

    // Calculate new status
    const newPaidTotal = currentPaid + data.amount;
    let newStatus = invoice.status;
    let paidAt = invoice.paidAt;

    if (newPaidTotal >= totalAmount) {
      newStatus = 'PAID';
      paidAt = data.paymentDate;
    } else if (newPaidTotal > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    // Update the invoice
    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        status: newStatus,
        paidAt,
      },
    });

    // Send mock notification
    // Note: We're calling this after the transaction block implicitly, 
    // but Prisma doesn't block external calls. We will just await it here.
    await sendNotification({
      tenantId: invoice.tenantId,
      type: 'PAYMENT_RECEIPT',
      channel: 'EMAIL',
      invoiceId: invoice.id,
      metadata: {
        amount: data.amount,
      },
    });

    await logAuditAction({
      userId,
      entityType: 'PAYMENT',
      entityId: payment.id,
      action: 'CREATE',
      metadata: { amount: data.amount, invoiceId: invoice.id },
    });

    return payment;
  });
}
