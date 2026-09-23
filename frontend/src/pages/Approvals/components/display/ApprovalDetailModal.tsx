import { createPortal } from "react-dom";
import Button from "@/components/ui/button/Button";

import { ApprovalDetailModalProps } from "../interface";

import ApprovalBadge from "./ApprovalBadge";

export default function ApprovalDetailModal({
  open,
  approval,
  onClose,
}: ApprovalDetailModalProps) {
  if (!open || !approval) return null;

  const reservation = approval.reservasi;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold dark:text-white">
          Reservation Detail
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-500">Reservation Number</label>
            <p className="font-medium dark:text-white">
              {reservation?.nomor_reservasi}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Status</label>

            <div className="mt-1">
              <ApprovalBadge status={approval.status} />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Applicant</label>

            <p className="font-medium dark:text-white">
              {reservation?.pemohon?.name ?? "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Driver</label>

            <p className="font-medium dark:text-white">
              {reservation?.pengemudi?.nama ?? "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Vehicle</label>

            <p className="font-medium dark:text-white">
              {reservation?.kendaraan
                ? `${reservation.kendaraan.kode_kendaraan} (${reservation.kendaraan.plat_nomor})`
                : "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Destination</label>

            <p className="font-medium dark:text-white">{reservation?.tujuan}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Start Date</label>

            <p className="font-medium dark:text-white">
              {reservation?.tanggal_mulai
                ? new Date(reservation.tanggal_mulai).toLocaleString("id-ID")
                : "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">End Date</label>

            <p className="font-medium dark:text-white">
              {reservation?.tanggal_selesai
                ? new Date(reservation.tanggal_selesai).toLocaleString("id-ID")
                : "-"}
            </p>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-500">Purpose</label>

            <p className="font-medium dark:text-white">
              {reservation?.keperluan}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
