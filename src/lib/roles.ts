export const ROLES = {
  LAB_ADMIN: "LAB_ADMIN",
  DOCTOR: "DOCTOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  SUBMITTED: "SUBMITTED",
  KIT_RECEIVED: "KIT_RECEIVED",
  PROCESSING: "PROCESSING",
  RESULTS_READY: "RESULTS_READY",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export function isLabRole(role: string) {
  return role === ROLES.LAB_ADMIN;
}
