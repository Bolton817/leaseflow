import prisma from '@/lib/db';

export async function getAuditLogs(userId: string) {
  // Only fetch logs for actions this user performed
  return prisma.auditLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function logAuditAction(data: {
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata: any;
}) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      metadata: JSON.stringify(data.metadata),
    },
  });
}
