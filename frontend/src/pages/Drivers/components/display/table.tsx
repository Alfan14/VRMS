"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

import { createPortal } from "react-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { PrintExportModal } from "@/components/ui/print/print-export-modal";

import { Driver, DriverFormData, AlertInfo, Kantor } from "../interface";

import {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getKantor,
} from "../endpoint";

export default function DriversTable() {
  /**
   * Master Data
   */
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [kantorList, setKantorList] = useState<Kantor[]>([]);

  /**
   * Loading
   */
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  /**
   * Search
   */
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Pagination
   */
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  /**
   * Modal
   */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  /**
   * Alert
   */
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });

  /**
   * Form
   */
  const [formData, setFormData] = useState<DriverFormData>({
    kantor_id: "",
    nama: "",
    no_hp: "",
    sim_nomor: "",
    sim_expired: "",
    status: "AVAILABLE",
  });

  /**
   * Alert Helper
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
    }, 4000);
  };

  /**
   * Fetch Drivers
   */
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDrivers();

      setDrivers(response.data.data ?? []);
    } catch (error) {
      console.error(error);

      showAlert("error", "Error", "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch Kantor
   */
  const fetchKantor = useCallback(async () => {
    try {
      const response = await getKantor();


      setKantorList(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
    fetchKantor();
  }, [fetchDrivers, fetchKantor]);

  /**
   * Search
   */
  const filteredDrivers = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return drivers.filter(
      (driver) =>
        driver.nama.toLowerCase().includes(keyword) ||
        driver.no_hp.toLowerCase().includes(keyword) ||
        driver.sim_nomor.toLowerCase().includes(keyword) ||
        driver.kantor?.nama_kantor?.toLowerCase().includes(keyword),
    );
  }, [drivers, searchQuery]);

  /**
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / itemsPerPage),
  );

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Input Change
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Create Modal
   */
  const openCreateModal = () => {
    setFormData({
      kantor_id: "",
      nama: "",
      no_hp: "",
      sim_nomor: "",
      sim_expired: "",
      status: "AVAILABLE",
    });

    setIsCreateModalOpen(true);
  };

  /**
   * Edit Modal
   */
  const openEditModal = async (id: string) => {
    try {
      const response = await getDriver(id);

      const driver = response.data.data;

      setSelectedDriver(driver);

      setFormData({
        kantor_id: driver.kantor_id,
        nama: driver.nama,
        no_hp: driver.no_hp,
        sim_nomor: driver.sim_nomor,
        sim_expired: driver.sim_expired.substring(0, 10),
        status: driver.status,
      });

      setIsEditModalOpen(true);
    } catch (error) {
      console.error(error);

      showAlert("error", "Error", "Failed to load driver.");
    }
  };

  /**
   * Submit Create
   */
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      await createDriver(formData);

      showAlert("success", "Success", "Driver created successfully.");

      setIsCreateModalOpen(false);

      fetchDrivers();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Error",
        error.response?.data?.message ?? "Create failed.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Submit Edit
   */
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDriver) return;

    try {
      setSubmitLoading(true);

      await updateDriver(selectedDriver.id, formData);

      showAlert("success", "Success", "Driver updated successfully.");

      setIsEditModalOpen(false);

      fetchDrivers();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Error",
        error.response?.data?.message ?? "Update failed.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Delete
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this driver?")) return;

    try {
      await deleteDriver(id);

      showAlert("success", "Success", "Driver deleted successfully.");

      fetchDrivers();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Error",
        error.response?.data?.message ?? "Delete failed.",
      );
    }
  };

  /**
   * Pagination Handler
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationRange = (
    current: number,
    total: number,
  ): (number | string)[] => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift("...");

    if (current > 3) range.unshift(1);

    if (current + delta < total - 1) range.push("...");

    if (current < total - 2) range.push(total);

    if (range.length === 0) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    return range;
  };

  /**
   * Export
   */
  const reportColumns = [
    {
      header: "Kantor",
      accessor: "kantor",
    },
    {
      header: "Nama",
      accessor: "nama",
    },
    {
      header: "No HP",
      accessor: "no_hp",
    },
    {
      header: "SIM",
      accessor: "sim",
    },
    {
      header: "Expired",
      accessor: "expired",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  const formattedData = filteredDrivers.map((driver) => ({
    kantor: driver.kantor?.nama_kantor ?? "-",
    nama: driver.nama,
    no_hp: driver.no_hp,
    sim: driver.sim_nomor,
    expired: driver.sim_expired.substring(0, 10),
    status: driver.status,
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
            placeholder="Cari Driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Drivers_Report"
              data={formattedData}
              columns={reportColumns}
            />

            <Button variant="primary" onClick={openCreateModal}>
              Tambah Driver
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

                <TableCell isHeader>Kantor</TableCell>

                <TableCell isHeader>Nama</TableCell>

                <TableCell isHeader>No HP</TableCell>

                <TableCell isHeader>SIM</TableCell>

                <TableCell isHeader>SIM Expired</TableCell>

                <TableCell isHeader>Status</TableCell>

                <TableCell isHeader>Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    Loading...
                  </td>
                </TableRow>
              ) : paginatedDrivers.length === 0 ? (
                <TableRow>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    Tidak ada data driver.
                  </td>
                </TableRow>
              ) : (
                paginatedDrivers.map((driver, index) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell>{driver.kantor?.nama_kantor ?? "-"}</TableCell>

                    <TableCell>{driver.nama}</TableCell>

                    <TableCell>{driver.no_hp}</TableCell>

                    <TableCell>{driver.sim_nomor}</TableCell>

                    <TableCell>
                      {new Date(driver.sim_expired).toLocaleDateString("id-ID")}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          driver.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(driver.id)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(driver.id)}
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

      {/* Create Modal */}
      {isCreateModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold dark:text-white">
                Tambah Driver
              </h2>

              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Kantor
                    </label>

                    <select
                      name="kantor_id"
                      value={formData.kantor_id}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    >
                      <option value="">Pilih Kantor</option>

                      {kantorList.map((kantor) => (
                        <option key={kantor.id} value={kantor.id}>
                          {kantor.nama_kantor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Nama Driver
                    </label>

                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      No HP
                    </label>

                    <input
                      type="text"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      SIM Nomor
                    </label>

                    <input
                      type="text"
                      name="sim_nomor"
                      value={formData.sim_nomor}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      SIM Expired
                    </label>

                    <input
                      type="date"
                      name="sim_expired"
                      value={formData.sim_expired}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>

                      <option value="ASSIGNED">ASSIGNED</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Batal
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Saving..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Edit Modal */}
      {isEditModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold dark:text-white">
                Edit Driver
              </h2>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Kantor
                    </label>

                    <select
                      name="kantor_id"
                      value={formData.kantor_id}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    >
                      {kantorList.map((kantor) => (
                        <option key={kantor.id} value={kantor.id}>
                          {kantor.nama_kantor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Nama Driver
                    </label>

                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      No HP
                    </label>

                    <input
                      type="text"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      SIM Nomor
                    </label>

                    <input
                      type="text"
                      name="sim_nomor"
                      value={formData.sim_nomor}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      SIM Expired
                    </label>

                    <input
                      type="date"
                      name="sim_expired"
                      value={formData.sim_expired}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>

                      <option value="ASSIGNED">ASSIGNED</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Batal
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Updating..." : "Update"}
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
