"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";

import { createPortal } from "react-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

import Button from "../../../../components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { PrintExportModal } from "@/components/ui/print/print-export-modal";

import {
  getPendingLevel1,
  getPendingLevel2,
  approveLevel1,
  approveLevel2,
  rejectLevel1,
  rejectLevel2,
} from "../endpoint";

import {
  Approval,
  ApprovalFormData,
  ApprovalTableProps,
  AlertInfo,
} from "../interface";

import { APPROVAL_LEVEL_1, APPROVAL_LEVEL_2 } from "../constants";

import ApprovalBadge from "./ApprovalBadge";
import ApprovalDetailModal from "./ApprovalDetailModal";
import ApprovalActionModal from "./ApprovalActionModal";

export default function ApprovalTable({ level }: ApprovalTableProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });

  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null,
  );

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState<ApprovalFormData>({
    catatan: "",
  });

  /**
   * Alert
   */

  const showAlert = (
    variant: "success" | "error" | "warning" | "info",
    title: string,
    message: string,
  ) => {
    setAlertInfo({
      show: true,
      variant,
      title,
      message,
    });

    setTimeout(() => {
      setAlertInfo((prev) => ({
        ...prev,
        show: false,
      }));
    }, 5000);
  };

  /**
   * Fetch Pending
   */

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        level === APPROVAL_LEVEL_1
          ? await getPendingLevel1()
          : await getPendingLevel2();

      const approvalArray = response?.data?.data ?? response?.data ?? [];

      setApprovals(Array.isArray(approvalArray) ? approvalArray : []);
    } catch (error) {
      console.error(error);

      setApprovals([]);

      showAlert("error", "Gagal", "Gagal memuat data approval.");
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  /**
   * Search
   */

  const filteredApprovals = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return approvals.filter((item) => {
      const reservation = item.reservasi;

      return (
        reservation?.nomor_reservasi?.toLowerCase().includes(keyword) ||
        reservation?.kendaraan?.kode_kendaraan
          ?.toLowerCase()
          .includes(keyword) ||
        reservation?.kendaraan?.plat_nomor?.toLowerCase().includes(keyword) ||
        reservation?.pengemudi?.nama?.toLowerCase().includes(keyword) ||
        reservation?.pemohon?.name?.toLowerCase().includes(keyword) ||
        reservation?.tujuan?.toLowerCase().includes(keyword)
      );
    });
  }, [approvals, searchQuery]);

  /**
   * Pagination
   */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApprovals.length / itemsPerPage),
  );

  const paginatedApprovals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredApprovals.slice(start, start + itemsPerPage);
  }, [filteredApprovals, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Detail
   */

  const handleDetail = (approval: Approval) => {
    setSelectedApproval(approval);
    setDetailModalOpen(true);
  };

  /**
   * Approve
   */

  const handleOpenApprove = (approval: Approval) => {
    setSelectedApproval(approval);

    setFormData({
      catatan: "",
    });

    setApproveModalOpen(true);
  };

  /**
   * Reject
   */

  const handleOpenReject = (approval: Approval) => {
    setSelectedApproval(approval);

    setFormData({
      catatan: "",
    });

    setRejectModalOpen(true);
  };

  /**
   * Form Change
   */

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      catatan: e.target.value,
    });
  };

  /**
   * Submit Approve
   */

  const handleApprove = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedApproval) return;

    try {
      setSubmitLoading(true);

      if (level === APPROVAL_LEVEL_1) {
        await approveLevel1(selectedApproval.id, formData);
      } else {
        await approveLevel2(selectedApproval.id, formData);
      }

      showAlert("success", "Berhasil", "Approval berhasil.");

      setApproveModalOpen(false);

      fetchApprovals();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Approval gagal.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Submit Reject
   */

  const handleReject = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedApproval) return;

    try {
      setSubmitLoading(true);

      if (level === APPROVAL_LEVEL_1) {
        await rejectLevel1(selectedApproval.id, formData);
      } else {
        await rejectLevel2(selectedApproval.id, formData);
      }

      showAlert("success", "Berhasil", "Reservation berhasil ditolak.");

      setRejectModalOpen(false);

      fetchApprovals();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Reject gagal.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Pagination
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Pagination Range
   */
  const getPaginationRange = (
    currentPage: number,
    totalPages: number,
  ): (number | string)[] => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");

    if (currentPage - delta >= 2) range.unshift(1);

    if (currentPage + delta < totalPages - 1) range.push("...");

    if (currentPage + delta <= totalPages - 1) range.push(totalPages);

    if (range[0] !== 1) range.unshift(1);

    if (range[range.length - 1] !== totalPages) range.push(totalPages);

    return range.filter((item, index) => {
      if (
        item === "..." &&
        (index === 0 ||
          index === range.length - 1 ||
          range[index - 1] === "...")
      ) {
        return false;
      }

      return range.indexOf(item) === index;
    });
  };

  /**
   * Export
   */
  const reportColumns = [
    {
      header: "Reservation",
      accessor: "nomor_reservasi",
    },
    {
      header: "Vehicle",
      accessor: "vehicle",
    },
    {
      header: "Driver",
      accessor: "driver",
    },
    {
      header: "Applicant",
      accessor: "applicant",
    },
    {
      header: "Destination",
      accessor: "destination",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  const formattedData = filteredApprovals.map((item) => ({
    nomor_reservasi: item.reservasi?.nomor_reservasi ?? "-",

    vehicle: item.reservasi?.kendaraan
      ? `${item.reservasi.kendaraan.kode_kendaraan} (${item.reservasi.kendaraan.plat_nomor})`
      : "-",

    driver: item.reservasi?.pengemudi?.nama ?? "-",

    applicant: item.reservasi?.pemohon?.name ?? "-",

    destination: item.reservasi?.tujuan ?? "-",

    status: item.status,
  }));

  return (
    <div className="space-y-4 relative">
      {/* Alert */}
      {alertInfo.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-[999999] w-full max-w-sm">
            <Alert
              variant={alertInfo.variant}
              title={alertInfo.title}
              message={alertInfo.message}
            />
          </div>,
          document.body,
        )}

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Cari Approval..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <PrintExportModal
            title={
              level === APPROVAL_LEVEL_1
                ? "Approval_Level_1"
                : "Approval_Level_2"
            }
            data={formattedData}
            columns={reportColumns}
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>No</TableCell>

                <TableCell isHeader>Reservation</TableCell>

                <TableCell isHeader>Vehicle</TableCell>

                <TableCell isHeader>Driver</TableCell>

                <TableCell isHeader>Applicant</TableCell>

                <TableCell isHeader>Destination</TableCell>

                <TableCell isHeader>Start</TableCell>

                <TableCell isHeader>Finish</TableCell>

                <TableCell isHeader>Status</TableCell>

                <TableCell isHeader>Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={10} className="px-6 py-8 text-center">
                    Loading...
                  </td>
                </TableRow>
              ) : paginatedApprovals.length === 0 ? (
                <TableRow>
                  <td colSpan={10} className="px-6 py-8 text-center">
                    Tidak ada data approval.
                  </td>
                </TableRow>
              ) : (
                paginatedApprovals.map((approval, index) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {approval.reservasi?.nomor_reservasi ?? "-"}
                    </TableCell>

                    <TableCell>
                      {approval.reservasi?.kendaraan
                        ? `${approval.reservasi.kendaraan.kode_kendaraan} (${approval.reservasi.kendaraan.plat_nomor})`
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {approval.reservasi?.pengemudi?.nama ?? "-"}
                    </TableCell>

                    <TableCell>
                      {approval.reservasi?.pemohon?.name ?? "-"}
                    </TableCell>

                    <TableCell>{approval.reservasi?.tujuan ?? "-"}</TableCell>

                    <TableCell>
                      {approval.reservasi?.tanggal_mulai
                        ? new Date(
                            approval.reservasi.tanggal_mulai,
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {approval.reservasi?.tanggal_selesai
                        ? new Date(
                            approval.reservasi.tanggal_selesai,
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <ApprovalBadge status={approval.status} />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDetail(approval)}
                        >
                          Detail
                        </Button>

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenApprove(approval)}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReject(approval)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </Button>

          {getPaginationRange(currentPage, totalPages).map(
            (page: number | string, index: number) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2">...</span>
                ) : (
                  <Button
                    size="sm"
                    variant={currentPage === page ? "primary" : "outline"}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <ApprovalDetailModal
        open={detailModalOpen}
        approval={selectedApproval}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedApproval(null);
        }}
      />

      {/* Approve Modal */}
      <ApprovalActionModal
        open={approveModalOpen}
        type="approve"
        loading={submitLoading}
        formData={formData}
        onChange={handleChange}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedApproval(null);
          setFormData({
            catatan: "",
          });
        }}
        onSubmit={handleApprove}
      />

      {/* Reject Modal */}
      <ApprovalActionModal
        open={rejectModalOpen}
        type="reject"
        loading={submitLoading}
        formData={formData}
        onChange={handleChange}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedApproval(null);
          setFormData({
            catatan: "",
          });
        }}
        onSubmit={handleReject}
      />
    </div>
  );
}
