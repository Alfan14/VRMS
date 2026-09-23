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
  getVehicleUsages,
  getReservations,
  startVehicleUsage,
  finishVehicleUsage,
} from "../endpoint";

import {
  VehicleUsage,
  Reservation,
  StartUsageFormData,
  FinishUsageFormData,
  AlertInfo,
} from "../interface";

export default function VehicleUsageTable() {
  const [vehicleUsages, setVehicleUsages] = useState<VehicleUsage[]>([]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [alertInfo, setAlertInfo] =
    useState<AlertInfo>({
      show: false,
      variant: "success",
      title: "",
      message: "",
    });

  const [
    isStartModalOpen,
    setIsStartModalOpen,
  ] = useState(false);

  const [
    isFinishModalOpen,
    setIsFinishModalOpen,
  ] = useState(false);

  const [
    selectedReservation,
    setSelectedReservation,
  ] = useState<Reservation | null>(null);

  const [
    selectedUsage,
    setSelectedUsage,
  ] = useState<VehicleUsage | null>(null);

  const [
    startForm,
    setStartForm,
  ] =
    useState<StartUsageFormData>({
      reservasi_id: "",
      odometer_awal: 0,
    });

  const [
    finishForm,
    setFinishForm,
  ] =
    useState<FinishUsageFormData>({
      odometer_akhir: 0,
      catatan: "",
    });

  const showAlert = (
    variant:
      | "success"
      | "error"
      | "warning"
      | "info",
    title: string,
    message: string
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
   * Fetch Vehicle Usage
   */
  const fetchVehicleUsage =
    useCallback(async () => {
      try {
        setLoading(true);
        const response = await getVehicleUsages();
        const usageArray = response?.data?.data ?? response?.data ?? [];

        setVehicleUsages(
          Array.isArray( usageArray )  ? usageArray : []
        );
      } catch (error) {
        console.error(error);
        setVehicleUsages([]);
        showAlert(
          "error",
          "Gagal",
          "Gagal memuat data vehicle usage."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /**
   * Fetch Reservation
   */
  const fetchReservations =
    useCallback(async () => {
      try {
        const response =  await getReservations();
        const reservationArray =  response?.data?.data ??  response?.data ?? [];
        setReservations( Array.isArray( reservationArray ) ? reservationArray : [] );
      } catch (error) {
        console.error(error);
      }
    }, []);

  useEffect(() => {
    fetchVehicleUsage();
    fetchReservations();
  }, [
    fetchVehicleUsage,
    fetchReservations,
  ]);

  /**
   * Search
   */
  const filteredReservations =
    useMemo(() => {
      const keyword =
        searchQuery.toLowerCase();

      return reservations.filter(
        (item) =>
          item.nomor_reservasi
            ?.toLowerCase()
            .includes(keyword) ||
          item.kendaraan?.kode_kendaraan
            ?.toLowerCase()
            .includes(keyword) ||
          item.kendaraan?.plat_nomor
            ?.toLowerCase()
            .includes(keyword) ||
          item.pengemudi?.nama
            ?.toLowerCase()
            .includes(keyword) ||
          item.tujuan
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [
      reservations,
      searchQuery,
    ]);

  /**
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReservations.length /
        itemsPerPage
    )
  );

  const paginatedReservations =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredReservations.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredReservations,
      currentPage,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Open Start Modal
   */
  const handleStart = (
    reservation: Reservation
  ) => {
    setSelectedReservation(
      reservation
    );

    setStartForm({
      reservasi_id:
        reservation.id,
      odometer_awal: 0,
    });

    setIsStartModalOpen(true);
  };

  /**
   * Open Finish Modal
   */
  const handleFinish = (
    usage: VehicleUsage
  ) => {
    setSelectedUsage(usage);

    setFinishForm({
      odometer_akhir: 0,
      catatan: "",
    });

    setIsFinishModalOpen(true);
  };

  /**
   * Input Change
   */
  const handleStartChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } =  e.target;

    setStartForm((prev) => ({
      ...prev,
      [name]:
        name ===
        "odometer_awal"
          ? Number(value)
          : value,
    }));
  };

  const handleFinishChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } =
      e.target;

    setFinishForm((prev) => ({
      ...prev,
      [name]:
        name ===
        "odometer_akhir"
          ? Number(value)
          : value,
    }));
  };

  /**
   * Submit Start
   */
  const handleStartSubmit =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      try {
        await startVehicleUsage(
          startForm
        );

        setIsStartModalOpen(false);

        showAlert(
          "success",
          "Berhasil",
          "Vehicle usage berhasil dimulai."
        );

        fetchVehicleUsage();
      } catch (error: any) {
        console.error(error);

        showAlert(
          "error",
          "Gagal",
          error?.response?.data
            ?.message ??
            "Gagal memulai perjalanan."
        );
      }
    };

  /**
   * Submit Finish
   */
  const handleFinishSubmit =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      if (!selectedUsage) return;

      try {
        await finishVehicleUsage(
          selectedUsage.id,
          finishForm
        );

        setIsFinishModalOpen(
          false
        );

        showAlert(
          "success",
          "Berhasil",
          "Perjalanan selesai."
        );

        fetchVehicleUsage();
      } catch (error: any) {
        console.error(error);

        showAlert(
          "error",
          "Gagal",
          error?.response?.data
            ?.message ??
            "Gagal menyelesaikan perjalanan."
        );
      }
    };

  /**
   * Pagination
   */
  const handlePageChange = ( page: number ) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  const reportColumns = [
    {
      header: "Reservasi",
      accessor:
        "nomor_reservasi",
    },
    {
      header: "Kendaraan",
      accessor: "kendaraan",
    },
    {
      header: "Driver",
      accessor: "driver",
    },
    {
      header: "Tujuan",
      accessor: "tujuan",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  /**
   * Pagination Number Generator
   */
  const getPaginationRange = (
    currentPage: number,
    totalPages: number
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

    if (currentPage - delta > 2) {
      range.unshift("...");
    }

    if (currentPage - delta >= 2) {
      range.unshift(1);
    }

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    if (currentPage + delta <= totalPages - 1) {
      range.push(totalPages);
    }

    if (range[0] !== 1) {
      range.unshift(1);
    }

    if (range[range.length - 1] !== totalPages) {
      range.push(totalPages);
    }

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

  const formattedData =
    filteredReservations.map(
      (item) => ({
        nomor_reservasi:item.nomor_reservasi,
        kendaraan: item.kendaraan? `${item.kendaraan.kode_kendaraan} (${item.kendaraan.plat_nomor})`: "-",
        driver: item.pengemudi?.nama ?? "-",
        tujuan: item.tujuan,
        status: item.status,
      })
    );

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
          document.body
        )}

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">

          <input
            type="text"
            placeholder="Cari Vehicle Usage..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Vehicle_Usage_Report"
              data={formattedData}
              columns={reportColumns}
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableCell isHeader>
                  No
                </TableCell>

                <TableCell isHeader>
                  Nomor Reservasi
                </TableCell>

                <TableCell isHeader>
                  Kendaraan
                </TableCell>

                <TableCell isHeader>
                  Driver
                </TableCell>

                <TableCell isHeader>
                  Tujuan
                </TableCell>

                <TableCell isHeader>
                  Tanggal
                </TableCell>

                <TableCell isHeader>
                  Reservasi
                </TableCell>

                <TableCell isHeader>
                  Journey
                </TableCell>

                <TableCell isHeader>
                  Action
                </TableCell>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (

                <TableRow>

                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center"
                  >
                    Loading...
                  </td>

                </TableRow>

              ) : paginatedReservations.length === 0 ? (

                <TableRow>

                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center"
                  >
                    Tidak ada data.
                  </td>

                </TableRow>

              ) : (

                paginatedReservations.map(
                  (reservation, index) => {

                    const usage =
                      vehicleUsages.find(
                        (item) =>
                          item.reservasi_id ===
                          reservation.id
                      );

                    return (

                      <TableRow
                        key={reservation.id}
                      >

                        <TableCell>
                          {(currentPage - 1) *
                            itemsPerPage +
                            index +
                            1}
                        </TableCell>

                        <TableCell>
                          {
                            reservation.nomor_reservasi
                          }
                        </TableCell>

                        <TableCell>

                          {reservation.kendaraan
                            ? `${reservation.kendaraan.kode_kendaraan}
                               (${reservation.kendaraan.plat_nomor})`
                            : "-"}

                        </TableCell>

                        <TableCell>

                          {reservation
                            .pengemudi?.nama ??
                            "-"}

                        </TableCell>

                        <TableCell>
                          {reservation.tujuan}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            reservation.tanggal_mulai
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
                              ${
                                reservation.status === "APPROVED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300": reservation.status === "PENDING_LV1"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"  : reservation.status === "PENDING_LV2"? 
                                "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300": reservation.status === "REJECTED"? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {reservation.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {!usage ? (
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              NOT STARTED
                            </span>
                          ) : usage.finished_at ? (

                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              COMPLETED
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              IN PROGRESS
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            {reservation.status === "APPROVED" &&!usage && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleStart(
                                    reservation
                                  )
                                }
                              >
                                Start
                              </Button>
                            )}

                            {usage &&
                              !usage.finished_at && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleFinish(
                                    usage
                                  )
                                }
                              >
                                Finish
                              </Button>
                            )}

                            {usage?.finished_at && (
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                Completed
                              </span>
                            )}

                          </div>
                        </TableCell>
                      </TableRow>
                    );

                  }
                )

              )}

            </TableBody>

          </Table>

        </div>
      </div>

      {/* Pagination */}

      {totalPages > 0 && (

        <div className="flex justify-end gap-2">

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
          >
            Prev
          </Button>

          {getPaginationRange(
            currentPage,
            totalPages
          ).map((page, index) => (

            <React.Fragment key={index}>

              {page === "..." ? (

                <span className="px-2">
                  ...
                </span>

              ) : (

                <Button
                  size="sm"
                  variant={
                    currentPage === page
                      ? "primary"
                      : "outline"
                  }
                  onClick={() =>
                    handlePageChange(
                      page as number
                    )
                  }
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={
              currentPage === totalPages
            }
            onClick={() => handlePageChange( currentPage + 1 )}
          >
            Next
          </Button>
        </div>
      )}

            {/* Start Usage Modal */}
      {isStartModalOpen &&
        selectedReservation &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">

              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                Start Vehicle Usage
              </h2>

              <form
                onSubmit={handleStartSubmit}
                className="space-y-4"
              >
                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Reservasi
                  </label>

                  <input
                    value={
                      selectedReservation.nomor_reservasi
                    }
                    readOnly
                    className="mt-1 w-full rounded-md border bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kendaraan
                  </label>

                  <input
                    value={`${selectedReservation.kendaraan.kode_kendaraan} (${selectedReservation.kendaraan.plat_nomor})`}
                    readOnly
                    className="mt-1 w-full rounded-md border bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Driver
                  </label>

                  <input
                    value={
                      selectedReservation.pengemudi.nama
                    }
                    readOnly
                    className="mt-1 w-full rounded-md border bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Odometer Awal
                  </label>

                  <input
                    type="number"
                    min={0}
                    required
                    name="odometer_awal"
                    value={startForm.odometer_awal}
                    onChange={handleStartChange}
                    className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div className="mt-6 flex justify-end gap-3">

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setIsStartModalOpen(false)
                    }
                  >
                    Batal
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                  >
                    Start Journey
                  </Button>

                </div>

              </form>

            </div>
          </div>,
          document.body
        )}

      {/* Finish Usage Modal */}
      {isFinishModalOpen &&
        selectedUsage &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">

              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                Finish Vehicle Usage
              </h2>

              <form
                onSubmit={handleFinishSubmit}
                className="space-y-4"
              >
                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Odometer Awal
                  </label>

                  <input
                    value={
                      selectedUsage.odometer_awal
                    }
                    readOnly
                    className="mt-1 w-full rounded-md border bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Odometer Akhir
                  </label>

                  <input
                    type="number"
                    min={
                      selectedUsage.odometer_awal
                    }
                    required
                    name="odometer_akhir"
                    value={
                      finishForm.odometer_akhir
                    }
                    onChange={
                      handleFinishChange
                    }
                    className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Catatan
                  </label>

                  <textarea
                    rows={4}
                    required
                    name="catatan"
                    value={finishForm.catatan}
                    onChange={
                      handleFinishChange
                    }
                    className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                <div className="mt-6 flex justify-end gap-3">

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setIsFinishModalOpen(false)
                    }
                  >
                    Batal
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                  >
                    Finish Journey
                  </Button>

                </div>

              </form>

            </div>
          </div>,
          document.body
        )}
    </div>
  );
}