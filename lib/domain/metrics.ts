import prisma from '@/lib/db';

export async function getDashboardMetrics(userId: string) {
  // 1. Portfolio Size & Occupancy
  const propertiesCount = await prisma.property.count({
    where: { ownerId: userId, isActive: true },
  });

  const units = await prisma.unit.findMany({
    where: {
      property: { ownerId: userId },
    },
    include: {
      tenants: {
        where: { status: 'ACTIVE' },
      },
    },
  });

  const unitsCount = units.length;
  const activeTenantsCount = units.filter((u) => u.tenants.length > 0).length;
  const occupancyRate = unitsCount > 0 ? (activeTenantsCount / unitsCount) * 100 : 0;

  // 2. Financial Metrics
  
  // Outstanding Balance
  // We sum the amounts of invoices that are NOT PAID or CANCELLED, and subtract any partial payments.
  // A simpler MVP approach is just fetching those invoices and calculating in memory.
  const unpaidInvoices = await prisma.invoice.findMany({
    where: {
      unit: { property: { ownerId: userId } },
      status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] },
    },
    include: {
      payments: true,
    },
  });

  let outstandingBalance = 0;
  for (const inv of unpaidInvoices) {
    const total = Number(inv.amount);
    const paid = inv.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    outstandingBalance += (total - paid);
  }

  // Monthly Revenue (Payments made in the current month)
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthlyPayments = await prisma.payment.findMany({
    where: {
      unit: { property: { ownerId: userId } },
      paymentDate: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
  });

  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  // 3. Recent Activity (Latest 5 payments or invoices)
  const recentPayments = await prisma.payment.findMany({
    where: { unit: { property: { ownerId: userId } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { tenant: true },
  });

  const recentInvoices = await prisma.invoice.findMany({
    where: { unit: { property: { ownerId: userId } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { tenant: true },
  });

  // Interleave and sort by date descending
  const activity = [
    ...recentPayments.map(p => ({
      id: `pay-${p.id}`,
      type: 'PAYMENT',
      amount: Number(p.amount),
      date: p.createdAt,
      tenant: `${p.tenant.firstName} ${p.tenant.lastName}`,
    })),
    ...recentInvoices.map(i => ({
      id: `inv-${i.id}`,
      type: 'INVOICE',
      amount: Number(i.amount),
      date: i.createdAt,
      tenant: `${i.tenant.firstName} ${i.tenant.lastName}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return {
    propertiesCount,
    unitsCount,
    occupancyRate,
    outstandingBalance,
    monthlyRevenue,
    activity,
  };
}
