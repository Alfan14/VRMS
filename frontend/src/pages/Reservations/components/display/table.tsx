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
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getVehicles,
  getDrivers,
} from "../endpoint";

import {
  Reservation,
  ReservationFormData,
  Vehicle,
  Driver,
  AlertInfo,
} from "../interface";

export default function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);

  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState<ReservationFormData>({
    kendaraan_id: "",
    pengemudi_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    tujuan: "",
    keperluan: "",
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
   * Fetch Reservation
   */
  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getReservations();
      const reservationArray = response?.data?.data ?? response?.data ?? [];

      setReservations(Array.isArray(reservationArray) ? reservationArray : []);
    } catch (error) {
      console.error(error);

      setReservations([]);

      showAlert("error", "Gagal", "Gagal memuat data reservasi.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch Vehicles
   */
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await getVehicles();

      const vehicleArray = response?.data?.data ?? response?.data ?? [];

      setVehicles(Array.isArray(vehicleArray) ? vehicleArray : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * Fetch Drivers
   */
  const fetchDrivers = useCallback(async () => {
    try {
      const response = await getDrivers();

      const driverArray = response?.data?.data ?? response?.data ?? [];

      setDrivers(Array.isArray(driverArray) ? driverArray : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchVehicles();
    fetchDrivers();
  }, [fetchReservations, fetchVehicles, fetchDrivers]);

  /**
   * Search
   */
  const filteredReservations = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return reservations.filter(
      (item) =>
        item.nomor_reservasi?.toLowerCase().includes(keyword) ||
        item.kendaraan?.kode_kendaraan?.toLowerCase().includes(keyword) ||
        item.kendaraan?.plat_nomor?.toLowerCase().includes(keyword) ||
        item.pengemudi?.nama?.toLowerCase().includes(keyword) ||
        item.tujuan?.toLowerCase().includes(keyword),
    );
  }, [reservations, searchQuery]);

  /**
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReservations.length / itemsPerPage),
  );

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredReservations.slice(start, start + itemsPerPage);
  }, [filteredReservations, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Create
   */
  const handleCreate = () => {
    setEditingReservation(null);

    setFormData({
      kendaraan_id: "",
      pengemudi_id: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      tujuan: "",
      keperluan: "",
    });

    setIsModalOpen(true);
  };

  /**
   * Edit
   */
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);

    setFormData({
      kendaraan_id: reservation.kendaraan_id,
      pengemudi_id: reservation.pengemudi_id,
      tanggal_mulai: reservation.tanggal_mulai,
      tanggal_selesai: reservation.tanggal_selesai,
      tujuan: reservation.tujuan,
      keperluan: reservation.keperluan,
    });

    setIsModalOpen(true);
  };
  /**
   * Delete
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus reservasi ini?")) {
      return;
    }

    try {
      await deleteReservation(id);

      showAlert("success", "Berhasil", "Reservasi berhasil dihapus.");

      fetchReservations();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Gagal menghapus reservasi.",
      );
    }
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
      [name]: value,
    }));
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
   * Submit
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (editingReservation) {
        await updateReservation(editingReservation.id, formData);
      } else {
        await createReservation(formData);
      }

      setIsModalOpen(false);

      showAlert(
        "success",
        "Berhasil",
        editingReservation
          ? "Reservasi berhasil diperbarui."
          : "Reservasi berhasil dibuat.",
      );

      fetchReservations();
    } catch (error: any) {
      console.error(error);

      const message = error?.response?.data?.message ?? "Terjadi kesalahan.";

      showAlert("error", "Gagal", message);
    }
  };

  /**
   * Pagination Number Generator
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
   * Export Data
   */
  const reportColumns = [
    {
      header: "Nomor Reservasi",
      accessor: "nomor_reservasi",
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
      header: "Tanggal Mulai",
      accessor: "tanggal_mulai",
    },
    {
      header: "Tanggal Selesai",
      accessor: "tanggal_selesai",
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

  const formattedData = filteredReservations.map((item) => ({
    nomor_reservasi: item.nomor_reservasi,
    kendaraan: item.kendaraan
      ? `${item.kendaraan.kode_kendaraan} (${item.kendaraan.plat_nomor})`
      : "-",
    driver: item.pengemudi?.nama ?? "-",
    tanggal_mulai: item.tanggal_mulai,
    tanggal_selesai: item.tanggal_selesai,
    tujuan: item.tujuan,
    status: item.status,
  }));

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      <span className="whitespace-nowrap">
        {date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })}
        <span className="ml-1 text-gray-400">
          {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-4 relative">
      {/* Alert */}
      {alertInfo.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-[999999] w-full max-w-sm drop-shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-5">
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
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <input
            type="text"
            placeholder="Cari Reservasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Daftar_Reservasi"
              data={formattedData}
              columns={reportColumns}
            />

            <Button variant="primary" onClick={handleCreate}>
              + Reservasi
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
                <TableCell isHeader>No. Reservasi</TableCell>
                <TableCell isHeader>Kendaraan</TableCell>
                <TableCell isHeader>Driver</TableCell>
                <TableCell isHeader>Tanggal Mulai</TableCell>
                <TableCell isHeader>Tanggal Selesai</TableCell>
                <TableCell isHeader>Tujuan</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={9} className="px-6 py-8 text-center">
                    Memuat data...
                  </td>
                </TableRow>
              ) : paginatedReservations.length === 0 ? (
                <TableRow>
                  <td colSpan={9} className="px-6 py-8 text-center">
                    Tidak ada data reservasi.
                  </td>
                </TableRow>
              ) : (
                paginatedReservations.map((reservation, index) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="whitespace-nowrap">
                      {reservation.nomor_reservasi}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {reservation.kendaraan
                        ? `${reservation.kendaraan.kode_kendaraan} (${reservation.kendaraan.plat_nomor})`
                        : "-"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {reservation.pengemudi?.nama ?? "-"}
                    </TableCell>

                    <TableCell>{formatDateTime(reservation.tanggal_mulai)}</TableCell>
                    <TableCell>{formatDateTime(reservation.tanggal_selesai)}</TableCell>
                    <TableCell className="max-w-[160px] truncate" title={reservation.tujuan}>
                      {reservation.tujuan}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          reservation.status === "PENDING_LV1"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                            : reservation.status === "APPROVED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : reservation.status === "REJECTED"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(reservation)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 border-red-300"
                        >
                          Delete
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
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </Button>

          {getPaginationRange(currentPage, totalPages).map((page, index) => (
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
          ))}

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

      {/* Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <h2 className="mb-5 text-xl font-bold dark:text-white">
                {editingReservation ? "Edit Reservasi" : "Tambah Reservasi"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Kendaraan</label>

                    <select
                      name="kendaraan_id"
                      value={formData.kendaraan_id}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    >
                      <option value="">Pilih Kendaraan</option>

                      {vehicles
                        .filter((v) => v.status === "AVAILABLE")
                        .map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.kode_kendaraan} ({v.plat_nomor})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label>Driver</label>

                    <select
                      name="pengemudi_id"
                      value={formData.pengemudi_id}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    >
                      <option value="">Pilih Driver</option>

                      {drivers
                        .filter((d) => d.status === "AVAILABLE")
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nama}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label>Tanggal Mulai</label>

                    <input
                      type="datetime-local"
                      name="tanggal_mulai"
                      value={formData.tanggal_mulai}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label>Tanggal Selesai</label>

                    <input
                      type="datetime-local"
                      name="tanggal_selesai"
                      value={formData.tanggal_selesai}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    />
                  </div>

                  <div className="col-span-2">
                    <label>Tujuan</label>

                    <input
                      type="text"
                      name="tujuan"
                      value={formData.tujuan}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    />
                  </div>

                  <div className="col-span-2">
                    <label>Keperluan</label>

                    <textarea
                      rows={4}
                      name="keperluan"
                      value={formData.keperluan}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded border p-2 dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </Button>

                  <Button variant="primary" type="submit">
                    Simpan
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
