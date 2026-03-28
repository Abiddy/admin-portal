import { ORDER_STATUS } from "@/lib/roles";

/** Border + background + text (Tailwind) for status badges */
export function orderStatusBadgeClass(status: string): string {
  switch (status) {
    case ORDER_STATUS.SUBMITTED:
      return "border-[#C7D4FF] bg-[#EEF2FF] text-[#3730A3]";
    case ORDER_STATUS.KIT_RECEIVED:
      return "border-[#FCD34D] bg-[#FFFBEB] text-[#B45309]";
    case ORDER_STATUS.PROCESSING:
      return "border-[#C4B5FD] bg-[#F5F3FF] text-[#5B21B6]";
    case ORDER_STATUS.RESULTS_READY:
      return "border-[#5EEAD4] bg-[#EDFAF7] text-[#0F766E]";
    default:
      return "border-[#E2E6EF] bg-[#F3F4F6] text-[#5A607F]";
  }
}

/** Solid fill for timeline dots (Tailwind) */
export function orderStatusDotClass(status: string): string {
  switch (status) {
    case ORDER_STATUS.SUBMITTED:
      return "bg-[#4C6FFF]";
    case ORDER_STATUS.KIT_RECEIVED:
      return "bg-[#F59E0B]";
    case ORDER_STATUS.PROCESSING:
      return "bg-[#7C3AED]";
    case ORDER_STATUS.RESULTS_READY:
      return "bg-[#14B8A6]";
    default:
      return "bg-[#94A3B8]";
  }
}

export function formatOrderStatus(status: string): string {
  switch (status) {
    case ORDER_STATUS.SUBMITTED:
      return "Submitted";
    case ORDER_STATUS.KIT_RECEIVED:
      return "Kit received";
    case ORDER_STATUS.PROCESSING:
      return "Processing";
    case ORDER_STATUS.RESULTS_READY:
      return "Results ready";
    default:
      return status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  }
}
