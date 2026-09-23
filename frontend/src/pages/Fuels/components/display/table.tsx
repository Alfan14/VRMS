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
  getFuelRecords,
  createFuelRecord,
  getVehicleUsages,
} from "../endpoint";

import {
  FuelRecord,
  FuelFormData,
  VehicleUsage,
  AlertInfo,
} from "../interface";

export default function FuelTable() {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [vehicleUsages, setVehicleUsages] = useState<VehicleUsage[]>([]);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState<VehicleUsage | null>(null);

  const [formData, setFormData] = useState<FuelFormData>({
    penggunaan_id: "",
    tanggal: "",
    liter: 0,
    harga_per_liter: 0,
    spbu: "",
    catatan: "",
  });

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
   * Fetch Fuel Records
   */
  const fetchFuelRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFuelRecords();
      const data = response?.data?.data ?? response?.data ?? [];

      setFuelRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      setFuelRecords([]);

      showAlert("error", "Error", "Gagal memuat data fuel.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch Vehicle Usage
   */
  const fetchVehicleUsages = useCallback(async () => {
    try {
      const response = await getVehicleUsages();
      const data = response?.data?.data ?? response?.data ?? [];

      setVehicleUsages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchFuelRecords();
    fetchVehicleUsages();
  }, [fetchFuelRecords, fetchVehicleUsages]);

  /**
   * Search
   */
  const filteredFuel = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return fuelRecords.filter(
      (item) =>
        item.penggunaan?.reservasi?.nomor_reservasi
          ?.toLowerCase()
          .includes(keyword) ||
        item.penggunaan?.reservasi?.tujuan?.toLowerCase().includes(keyword) ||
        item.spbu?.toLowerCase().includes(keyword),
    );
  }, [fuelRecords, searchQuery]);

  /**
   * Pagination
   */
  const totalPages = Math.max(1, Math.ceil(filteredFuel.length / itemsPerPage));

  const paginatedFuel = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredFuel.slice(start, start + itemsPerPage);
  }, [filteredFuel, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Open Modal
   */
  const handleCreate = (usage: VehicleUsage) => {
    setSelectedUsage(usage);

    setFormData({
      penggunaan_id: usage.id,
      tanggal: "",
      liter: 0,
      harga_per_liter: 0,
      spbu: "",
      catatan: "",
    });

    setIsModalOpen(true);
  };

  /**
   * Input Change
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "liter" || name === "harga_per_liter" ? Number(value) : value,
    }));
  };

  /**
   * Estimated Total
   */
  const estimatedTotal =
    Number(formData.liter) * Number(formData.harga_per_liter);

  /**
   * Submit
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createFuelRecord(formData);

      setIsModalOpen(false);

      showAlert("success", "Berhasil", "Fuel record berhasil dibuat.");

      fetchFuelRecords();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Gagal membuat fuel record.",
      );
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
   * Pagination Number
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
      header: "Reservasi",
      accessor: "nomor_reservasi",
    },
    {
      header: "Tanggal",
      accessor: "tanggal",
    },
    {
      header: "Liter",
      accessor: "liter",
    },
    {
      header: "Harga",
      accessor: "harga_per_liter",
    },
    {
      header: "Total",
      accessor: "total_biaya",
    },
    {
      header: "SPBU",
      accessor: "spbu",
    },
  ];

  const formattedData = filteredFuel.map((item) => ({
    nomor_reservasi: item.penggunaan?.reservasi?.nomor_reservasi ?? "-",

    tanggal: item.tanggal,

    liter: item.liter,

    harga_per_liter: item.harga_per_liter,

    total_biaya: item.total_biaya,

    spbu: item.spbu,
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
            placeholder="Cari Fuel Record..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Fuel_Record_Report"
              data={formattedData}
              columns={reportColumns}
            />

            <Button
              variant="primary"
              onClick={() => {
                setSelectedUsage(null);

                setFormData({
                  penggunaan_id: "",
                  tanggal: "",
                  liter: 0,
                  harga_per_liter: 0,
                  spbu: "",
                  catatan: "",
                });

                setIsModalOpen(true);
              }}
            >
              + Fuel Record
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>No</TableCell>
                <TableCell isHeader>Reservasi</TableCell>
                <TableCell isHeader>Kendaraan</TableCell>
                <TableCell isHeader>Driver</TableCell>
                <TableCell isHeader>Tanggal</TableCell>
                <TableCell isHeader>Liter</TableCell>
                <TableCell isHeader>Harga/Liter</TableCell>
                <TableCell isHeader>Total</TableCell>
                <TableCell isHeader>SPBU</TableCell>
                <TableCell isHeader>Status</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={10} className="px-6 py-8 text-center">
                    Loading...
                  </td>
                </TableRow>
              ) : paginatedFuel.length === 0 ? (
                <TableRow>
                  <td colSpan={10} className="px-6 py-8 text-center">
                    Tidak ada data Fuel Record.
                  </td>
                </TableRow>
              ) : (
                paginatedFuel.map((fuel, index) => (
                  <TableRow key={fuel.id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {fuel.penggunaan?.reservasi?.nomor_reservasi ?? "-"}
                    </TableCell>

                    <TableCell>
                      {fuel.penggunaan?.reservasi?.kendaraan_id ?? "-"}
                    </TableCell>

                    <TableCell>
                      {fuel.penggunaan?.reservasi?.pengemudi_id ?? "-"}
                    </TableCell>

                    <TableCell>
                      {new Date(fuel.tanggal).toLocaleDateString("id-ID")}
                    </TableCell>

                    <TableCell>
                      {Number(fuel.liter).toLocaleString("id-ID")} L
                    </TableCell>

                    <TableCell>
                      Rp {Number(fuel.harga_per_liter).toLocaleString("id-ID")}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        Rp {Number(fuel.total_biaya).toLocaleString("id-ID")}
                      </span>
                    </TableCell>

                    <TableCell>{fuel.spbu}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
                          ${
                            fuel.penggunaan?.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : fuel.penggunaan?.status === "FINISHED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {fuel.penggunaan?.status ?? "-"}
                      </span>
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
        <div className="flex justify-end gap-2">
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
      {/* Create Fuel Record Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Tambah Fuel Record
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Vehicle Usage */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vehicle Usage
                  </label>

                  <select
                    name="penggunaan_id"
                    value={formData.penggunaan_id}
                    onChange={(e) => {
                      handleInputChange(e);

                      const usage =
                        vehicleUsages.find(
                          (item) => item.id === e.target.value,
                        ) ?? null;

                      setSelectedUsage(usage);
                    }}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Pilih Vehicle Usage</option>

                    {vehicleUsages
                      .filter((usage) => usage.status === "IN_PROGRESS")
                      .map((usage) => (
                        <option key={usage.id} value={usage.id}>
                          {usage.reservasi.nomor_reservasi}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Reservation Info */}
                {selectedUsage && (
                  <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div>
                      <span className="text-xs text-gray-500">Reservation</span>
                      <div className="font-medium dark:text-white">
                        {selectedUsage.reservasi.nomor_reservasi}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500">Tujuan</span>
                      <div className="font-medium dark:text-white">
                        {selectedUsage.reservasi.tujuan}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500">Status</span>
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {selectedUsage.status}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Date */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tanggal
                    </label>

                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Liter */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Liter
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="liter"
                      value={formData.liter}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Harga */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Harga per Liter
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="harga_per_liter"
                      value={formData.harga_per_liter}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* SPBU */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SPBU
                    </label>

                    <input
                      type="text"
                      name="spbu"
                      value={formData.spbu}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Catatan
                  </label>

                  <textarea
                    rows={4}
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Estimated Total */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Estimated Total
                    </span>

                    <span className="text-lg font-bold text-green-700 dark:text-green-400">
                      Rp {estimatedTotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Nilai ini merupakan estimasi. Total biaya final dihitung
                    oleh server.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedUsage(null);
                    }}
                  >
                    Batal
                  </Button>

                  <Button variant="primary" type="submit">
                    Simpan Fuel Record
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
