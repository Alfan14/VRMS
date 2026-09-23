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
  getServices,
  createService,
  startService,
  completeService,
  getVehicles,
} from "../endpoint";

import {
  Service,
  Vehicle,
  ServiceFormData,
  CompleteServiceFormData,
  AlertInfo,
} from "../interface";

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
    kendaraan_id: "",
    tanggal_service: "",
    jenis_service: "",
    vendor: "",
    biaya: 0,
    keterangan: "",
  });

  const [completeForm, setCompleteForm] = useState<CompleteServiceFormData>({
    keterangan: "",
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
   * Fetch Services
   */
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getServices();

      const serviceArray = response?.data?.data ?? response?.data ?? [];

      setServices(Array.isArray(serviceArray) ? serviceArray : []);
    } catch (error) {
      console.error(error);

      setServices([]);

      showAlert("error", "Gagal", "Gagal memuat data service.");
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

  useEffect(() => {
    fetchServices();
    fetchVehicles();
  }, [fetchServices, fetchVehicles]);

  /**
   * Search
   */
  const filteredServices = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return services.filter(
      (service) =>
        service.kendaraan?.kode_kendaraan?.toLowerCase().includes(keyword) ||
        service.kendaraan?.plat_nomor?.toLowerCase().includes(keyword) ||
        service.vendor?.toLowerCase().includes(keyword) ||
        service.jenis_service?.toLowerCase().includes(keyword),
    );
  }, [services, searchQuery]);

  /**
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / itemsPerPage),
  );

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Create Modal
   */
  const handleCreate = () => {
    setFormData({
      kendaraan_id: "",
      tanggal_service: "",
      jenis_service: "",
      vendor: "",
      biaya: 0,
      keterangan: "",
    });

    setIsCreateModalOpen(true);
  };

  /**
   * Start Service
   */
  const handleStart = async (service: Service) => {
    if (!window.confirm("Apakah Anda yakin memulai service kendaraan ini?")) {
      return;
    }

    try {
      await startService(service.id);

      showAlert("success", "Berhasil", "Service berhasil dimulai.");

      fetchServices();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Gagal memulai service.",
      );
    }
  };

  /**
   * Complete Modal
   */
  const handleComplete = (service: Service) => {
    setSelectedService(service);

    setCompleteForm({
      keterangan: "",
    });

    setIsCompleteModalOpen(true);
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
      [name]: name === "biaya" ? Number(value) : value,
    }));
  };

  const handleCompleteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCompleteForm({
      keterangan: e.target.value,
    });
  };

  /**
   * Estimated Cost
   */
  const estimatedCost = Number(formData.biaya);

  /**
   * Submit Create
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createService(formData);

      setIsCreateModalOpen(false);

      showAlert("success", "Berhasil", "Jadwal service berhasil dibuat.");

      fetchServices();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Gagal membuat jadwal service.",
      );
    }
  };

  /**
   * Submit Complete
   */
  const handleCompleteSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    try {
      await completeService(selectedService.id, completeForm);

      setIsCompleteModalOpen(false);

      showAlert("success", "Berhasil", "Service selesai.");

      fetchServices();
    } catch (error: any) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        error?.response?.data?.message ?? "Gagal menyelesaikan service.",
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
      header: "Vehicle",
      accessor: "vehicle",
    },
    {
      header: "Tanggal",
      accessor: "tanggal_service",
    },
    {
      header: "Jenis",
      accessor: "jenis_service",
    },
    {
      header: "Vendor",
      accessor: "vendor",
    },
    {
      header: "Biaya",
      accessor: "biaya",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  const formattedData = filteredServices.map((item) => ({
    vehicle: item.kendaraan
      ? `${item.kendaraan.kode_kendaraan} (${item.kendaraan.plat_nomor})`
      : "-",

    tanggal_service: item.tanggal_service,

    jenis_service: item.jenis_service,

    vendor: item.vendor,

    biaya: item.biaya,

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
            placeholder="Cari Service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Service_Report"
              data={formattedData}
              columns={reportColumns}
            />

            <Button variant="primary" onClick={handleCreate}>
              + Jadwal Service
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

                <TableCell isHeader>Kendaraan</TableCell>

                <TableCell isHeader>Tanggal</TableCell>

                <TableCell isHeader>Jenis Service</TableCell>

                <TableCell isHeader>Vendor</TableCell>

                <TableCell isHeader>Biaya</TableCell>

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
              ) : paginatedServices.length === 0 ? (
                <TableRow>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    Tidak ada data service.
                  </td>
                </TableRow>
              ) : (
                paginatedServices.map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {service.kendaraan
                        ? `${service.kendaraan.kode_kendaraan} (${service.kendaraan.plat_nomor})`
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {new Date(service.tanggal_service).toLocaleDateString(
                        "id-ID",
                      )}
                    </TableCell>

                    <TableCell>{service.jenis_service}</TableCell>

                    <TableCell>{service.vendor}</TableCell>

                    <TableCell>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        Rp {Number(service.biaya).toLocaleString("id-ID")}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold

                          ${
                            service.status === "SCHEDULED"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : service.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                      >
                        {service.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {service.status === "SCHEDULED" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStart(service)}
                          >
                            Start
                          </Button>
                        )}

                        {service.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComplete(service)}
                          >
                            Complete
                          </Button>
                        )}

                        {service.status === "COMPLETED" && (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Completed
                          </span>
                        )}
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
                Tambah Jadwal Service
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Vehicle */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Kendaraan
                    </label>

                    <select
                      name="kendaraan_id"
                      value={formData.kendaraan_id}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    >
                      <option value="">Pilih Kendaraan</option>

                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.kode_kendaraan} ({vehicle.plat_nomor})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tanggal Service
                    </label>

                    <input
                      type="date"
                      name="tanggal_service"
                      value={formData.tanggal_service}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  {/* Jenis */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Jenis Service
                    </label>

                    <input
                      list="jenis-service"
                      name="jenis_service"
                      value={formData.jenis_service}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />

                    <datalist id="jenis-service">
                      <option value="Ganti Oli" />
                      <option value="Service Berkala" />
                      <option value="Tune Up" />
                      <option value="Spooring" />
                      <option value="Balancing" />
                      <option value="Penggantian Ban" />
                      <option value="Perbaikan Mesin" />
                      <option value="Perbaikan Rem" />
                    </datalist>
                  </div>

                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vendor
                    </label>

                    <input
                      list="vendor-list"
                      name="vendor"
                      value={formData.vendor}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />

                    <datalist id="vendor-list">
                      <option value="Auto2000" />
                      <option value="Mitsubishi Motors" />
                      <option value="Astra Daihatsu" />
                      <option value="Isuzu" />
                      <option value="Bosch Service" />
                      <option value="Hino" />
                    </datalist>
                  </div>

                  {/* Cost */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Biaya
                    </label>

                    <input
                      type="number"
                      name="biaya"
                      value={formData.biaya}
                      onChange={handleInputChange}
                      required
                      min={0}
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Keterangan
                    </label>

                    <textarea
                      rows={4}
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                    />
                  </div>
                </div>

                {/* Estimated Cost */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Estimated Cost</span>

                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      Rp {estimatedCost.toLocaleString("id-ID")}
                    </span>
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

                  <Button variant="primary" type="submit">
                    Simpan
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Complete Modal */}
      {isCompleteModalOpen &&
        selectedService &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold dark:text-white">
                Selesaikan Service
              </h2>

              <form onSubmit={handleCompleteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Keterangan
                  </label>

                  <textarea
                    rows={5}
                    required
                    value={completeForm.keterangan}
                    onChange={handleCompleteChange}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-700"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCompleteModalOpen(false)}
                  >
                    Batal
                  </Button>

                  <Button variant="primary" type="submit">
                    Complete Service
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
