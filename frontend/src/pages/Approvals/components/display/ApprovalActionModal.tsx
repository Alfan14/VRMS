import { createPortal } from "react-dom";
import Button from "@/components/ui/button/Button";

import { ApprovalActionModalProps } from "../interface";

export default function ApprovalActionModal({
  open,
  type,
  loading,
  formData,
  onChange,
  onClose,
  onSubmit,
}: ApprovalActionModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold dark:text-white">
          {type === "approve" ? "Approve Reservation" : "Reject Reservation"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catatan
            </label>

            <textarea
              rows={5}
              required
              value={formData.catatan}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : type === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
