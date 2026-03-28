import { prisma } from "@/lib/prisma";
import { isLabRole, ORDER_STATUS, ROLES } from "@/lib/roles";

export { formatOrderStatus } from "@/lib/order-format";

const ACTIVE_STATUSES = [
  ORDER_STATUS.SUBMITTED,
  ORDER_STATUS.KIT_RECEIVED,
  ORDER_STATUS.PROCESSING,
] as const;

export type DashboardOrderRow = {
  id: string;
  status: string;
  patientName: string | null;
  patientEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  submittedByName: string;
  practiceName: string | null;
};

const listSelect = {
  id: true,
  status: true,
  patientName: true,
  patientEmail: true,
  createdAt: true,
  updatedAt: true,
  submittedBy: { select: { name: true } },
  practice: { select: { name: true } },
} as const;

function mapRow(o: {
  id: string;
  status: string;
  patientName: string | null;
  patientEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  submittedBy: { name: string };
  practice: { name: string };
}): DashboardOrderRow {
  return {
    id: o.id,
    status: o.status,
    patientName: o.patientName,
    patientEmail: o.patientEmail,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    submittedByName: o.submittedBy.name,
    practiceName: o.practice.name,
  };
}

export async function getDashboardOrderLists(userId: string): Promise<{
  active: DashboardOrderRow[];
  resultsReady: DashboardOrderRow[];
  totalInScope: number;
  scope: "lab" | "practice" | "unassigned";
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { practiceId: true, role: true },
  });

  if (!user) {
    return { active: [], resultsReady: [], totalInScope: 0, scope: "unassigned" };
  }

  if (user.role === ROLES.LAB_ADMIN) {
    const [active, resultsReady, totalInScope] = await Promise.all([
      prisma.order.findMany({
        where: { status: { in: [...ACTIVE_STATUSES] } },
        orderBy: { updatedAt: "desc" },
        select: listSelect,
      }),
      prisma.order.findMany({
        where: { status: ORDER_STATUS.RESULTS_READY },
        orderBy: { updatedAt: "desc" },
        select: listSelect,
      }),
      prisma.order.count(),
    ]);
    return {
      active: active.map(mapRow),
      resultsReady: resultsReady.map(mapRow),
      totalInScope,
      scope: "lab",
    };
  }

  if (!user.practiceId) {
    return { active: [], resultsReady: [], totalInScope: 0, scope: "unassigned" };
  }

  const practiceWhere = { practiceId: user.practiceId };

  const [active, resultsReady, totalInScope] = await Promise.all([
    prisma.order.findMany({
      where: { ...practiceWhere, status: { in: [...ACTIVE_STATUSES] } },
      orderBy: { updatedAt: "desc" },
      select: listSelect,
    }),
    prisma.order.findMany({
      where: { ...practiceWhere, status: ORDER_STATUS.RESULTS_READY },
      orderBy: { updatedAt: "desc" },
      select: listSelect,
    }),
    prisma.order.count({ where: practiceWhere }),
  ]);

  return {
    active: active.map(mapRow),
    resultsReady: resultsReady.map(mapRow),
    totalInScope,
    scope: "practice",
  };
}

export async function getAllOrdersForUser(userId: string): Promise<{
  orders: DashboardOrderRow[];
  scope: "lab" | "practice" | "unassigned";
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { practiceId: true, role: true },
  });

  if (!user) {
    return { orders: [], scope: "unassigned" };
  }

  if (user.role === ROLES.LAB_ADMIN) {
    const orders = await prisma.order.findMany({
      orderBy: { updatedAt: "desc" },
      select: listSelect,
    });
    return { orders: orders.map(mapRow), scope: "lab" };
  }

  if (!user.practiceId) {
    return { orders: [], scope: "unassigned" };
  }

  const orders = await prisma.order.findMany({
    where: { practiceId: user.practiceId },
    orderBy: { updatedAt: "desc" },
    select: listSelect,
  });
  return { orders: orders.map(mapRow), scope: "practice" };
}

export type LabQueueRow = {
  id: string;
  status: string;
  patientName: string | null;
  patientEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  submittedByName: string;
  practiceName: string;
  resultCount: number;
};

const labQueueStatuses = new Set<string>(Object.values(ORDER_STATUS));

export async function getLabQueueOrders(statusFilter?: string | null): Promise<LabQueueRow[]> {
  const where =
    statusFilter && labQueueStatuses.has(statusFilter) ? { status: statusFilter } : {};

  const rows = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      status: true,
      patientName: true,
      patientEmail: true,
      createdAt: true,
      updatedAt: true,
      submittedBy: { select: { name: true } },
      practice: { select: { name: true } },
      _count: { select: { results: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    patientName: r.patientName,
    patientEmail: r.patientEmail,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    submittedByName: r.submittedBy.name,
    practiceName: r.practice.name,
    resultCount: r._count.results,
  }));
}

export async function getOrderForViewer(orderId: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { practiceId: true, role: true },
  });
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      practiceId: true,
      status: true,
      patientName: true,
      patientEmail: true,
      patientPhone: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      submittedBy: { select: { name: true, email: true } },
      practice: { select: { name: true } },
      results: {
        orderBy: { createdAt: "desc" },
        select: { id: true, fileName: true, fileKey: true, createdAt: true },
      },
      statusEvents: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          status: true,
          note: true,
          createdAt: true,
          actor: { select: { id: true, name: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!order) return null;

  if (isLabRole(user.role)) return order;
  if (user.practiceId && order.practiceId === user.practiceId) return order;
  return null;
}

export async function getResultForViewer(resultId: string, userId: string) {
  const result = await prisma.result.findUnique({
    where: { id: resultId },
    select: {
      id: true,
      fileName: true,
      fileKey: true,
      order: { select: { practiceId: true } },
    },
  });
  if (!result) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { practiceId: true, role: true },
  });
  if (!user) return null;

  if (isLabRole(user.role)) return result;
  if (user.practiceId && result.order.practiceId === user.practiceId) return result;
  return null;
}

const downloadableResult = { fileKey: { not: "__pending__" } } as const;

export type ResultsWorkspaceRow = {
  orderId: string;
  patientName: string | null;
  patientEmail: string | null;
  status: string;
  updatedAt: Date;
  submittedByName: string;
  practiceName: string | null;
  files: { id: string; fileName: string; createdAt: Date }[];
};

/** Orders that have at least one stored result PDF (Phase 5 — doctor / practice results library). */
export async function getResultsWorkspace(userId: string): Promise<{
  scope: "lab" | "practice" | "unassigned";
  rows: ResultsWorkspaceRow[];
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { practiceId: true, role: true },
  });
  if (!user) {
    return { scope: "unassigned", rows: [] };
  }

  if (user.role === ROLES.LAB_ADMIN) {
    const orders = await prisma.order.findMany({
      where: { results: { some: downloadableResult } },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        patientName: true,
        patientEmail: true,
        status: true,
        updatedAt: true,
        submittedBy: { select: { name: true } },
        practice: { select: { name: true } },
        results: {
          where: downloadableResult,
          orderBy: { createdAt: "desc" },
          select: { id: true, fileName: true, createdAt: true },
        },
      },
    });
    return {
      scope: "lab",
      rows: orders.map((o) => ({
        orderId: o.id,
        patientName: o.patientName,
        patientEmail: o.patientEmail,
        status: o.status,
        updatedAt: o.updatedAt,
        submittedByName: o.submittedBy.name,
        practiceName: o.practice.name,
        files: o.results.map((r) => ({
          id: r.id,
          fileName: r.fileName,
          createdAt: r.createdAt,
        })),
      })),
    };
  }

  if (!user.practiceId) {
    return { scope: "unassigned", rows: [] };
  }

  const orders = await prisma.order.findMany({
    where: {
      practiceId: user.practiceId,
      results: { some: downloadableResult },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      patientName: true,
      patientEmail: true,
      status: true,
      updatedAt: true,
      submittedBy: { select: { name: true } },
      practice: { select: { name: true } },
      results: {
        where: downloadableResult,
        orderBy: { createdAt: "desc" },
        select: { id: true, fileName: true, createdAt: true },
      },
    },
  });

  return {
    scope: "practice",
    rows: orders.map((o) => ({
      orderId: o.id,
      patientName: o.patientName,
      patientEmail: o.patientEmail,
      status: o.status,
      updatedAt: o.updatedAt,
      submittedByName: o.submittedBy.name,
      practiceName: o.practice.name,
      files: o.results.map((r) => ({
        id: r.id,
        fileName: r.fileName,
        createdAt: r.createdAt,
      })),
    })),
  };
}
