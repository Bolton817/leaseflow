import prisma from '@/lib/db';

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      tenant: {
        unit: {
          property: {
            ownerId: userId,
          },
        },
      },
    },
    include: {
      tenant: true,
      invoice: true,
    },
    orderBy: {
      sentAt: 'desc',
    },
  });
}

export async function sendNotification(data: {
  tenantId: string;
  type: 'INVOICE_ISSUED' | 'PAYMENT_RECEIPT' | 'REMINDER';
  channel: 'EMAIL' | 'SMS';
  invoiceId?: string;
  metadata?: any;
}) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: data.tenantId },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // 1. Mock sending the actual communication
  let content = '';
  if (data.type === 'INVOICE_ISSUED') {
    content = `Hello ${tenant.firstName},\nYour new invoice for ${data.metadata?.billingPeriod || 'this month'} is ready. Amount due: $${data.metadata?.amount}. Please pay by ${data.metadata?.dueDate}.`;
  } else if (data.type === 'PAYMENT_RECEIPT') {
    content = `Hello ${tenant.firstName},\nThank you for your payment of $${data.metadata?.amount}. This has been applied to your account.`;
  }

  console.log(`\n==============================================`);
  console.log(`[MOCK NOTIFICATION] - Sending via ${data.channel}`);
  console.log(`TO: ${data.channel === 'EMAIL' ? tenant.email : tenant.phone}`);
  console.log(`TYPE: ${data.type}`);
  console.log(`CONTENT:\n${content}`);
  console.log(`==============================================\n`);

  // 2. Record it in the database
  return prisma.notification.create({
    data: {
      tenantId: data.tenantId,
      invoiceId: data.invoiceId,
      type: data.type,
      channel: data.channel,
      status: 'SENT',
      sentAt: new Date(),
    },
  });
}
