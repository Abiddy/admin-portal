import { formatOrderStatus, orderStatusBadgeClass } from "@/lib/order-format";

export function OrderStatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${orderStatusBadgeClass(status)} ${className}`}
    >
      {formatOrderStatus(status)}
    </span>
  );
}
