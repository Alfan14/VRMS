import { ApprovalBadgeProps } from "../interface";
import { APPROVAL_STATUS } from "../constants";

export default function ApprovalBadge({ status }: ApprovalBadgeProps) {
  let className = "inline-flex rounded-full px-3 py-1 text-xs font-semibold ";

  switch (status) {
    case APPROVAL_STATUS.PENDING:
    case APPROVAL_STATUS.PENDING_LV1:
    case APPROVAL_STATUS.PENDING_LV2:
      className +=
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      break;

    case APPROVAL_STATUS.APPROVED:
      className +=
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      break;

    case APPROVAL_STATUS.REJECTED:
      className +=
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      break;

    default:
      className +=
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }

  return <span className={className}>{status}</span>;
}
