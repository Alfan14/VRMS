"use client";

import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useMemo,
  useCallback,
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
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../endpoint";

import { Vehicle, VehicleFormData, AlertInfo, Kantor } from "../interface";
import { getKantor } from "@/pages/Drivers/components/endpoint";

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [kantorList, setKantorList] = useState<Kantor[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    kantor_id: "",
    kode_kendaraan: "",
    plat_nomor: "",
    merk: "",
    tipe: "",
    tahun: "",
    warna: "",
    kapasitas_penumpang: 0,
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
   * Fetch Vehicles
   */
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getVehicles();

      const vehicleArray = response?.data?.data ?? response?.data ?? [];

      setVehicles(Array.isArray(vehicleArray) ? vehicleArray : []);
    } catch (error) {
      console.error(error);

      setVehicles([]);

      showAlert("error", "Koneksi Gagal", "Gagal memuat data kendaraan.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKantor = useCallback(async () => {
    try {
      const response = await getKantor();
      setKantorList(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchKantor();
  }, [fetchVehicles, fetchKantor]);

  /**
   * Client Search
   */
  const filteredVehicles = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return vehicles.filter((vehicle) => {
      return (
        vehicle.kode_kendaraan.toLowerCase().includes(keyword) ||
        vehicle.plat_nomor.toLowerCase().includes(keyword) ||
        vehicle.merk.toLowerCase().includes(keyword) ||
        vehicle.tipe.toLowerCase().includes(keyword) ||
        vehicle.warna.toLowerCase().includes(keyword)
      );
    });
  }, [vehicles, searchQuery]);

  /**
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / itemsPerPage),
  );

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Create
   */
  const handleCreate = () => {
    setEditingVehicle(null);

    setFormData({
      kantor_id: "",
      kode_kendaraan: "",
      plat_nomor: "",
      merk: "",
      tipe: "",
      tahun: "",
      warna: "",
      kapasitas_penumpang: 0,
    });

    setIsModalOpen(true);
  };

  /**
   * Edit
   */
  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    setFormData({
      kantor_id: vehicle.kantor_id,
      kode_kendaraan: vehicle.kode_kendaraan,
      plat_nomor: vehicle.plat_nomor,
      merk: vehicle.merk,
      tipe: vehicle.tipe,
      tahun: vehicle.tahun,
      warna: vehicle.warna,
      kapasitas_penumpang: vehicle.kapasitas_penumpang,
    });

    setIsModalOpen(true);
  };

  /**
   * Delete
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kendaraan ini?"))
      return;

    try {
      await deleteVehicle(id);

      showAlert("success", "Berhasil", "Data kendaraan berhasil dihapus.");

      fetchVehicles();
    } catch (error) {
      console.error(error);

      showAlert("error", "Gagal", "Gagal menghapus kendaraan.");
    }
  };

  /**
   * Input Change
   */
  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
      } else {
        await createVehicle(formData);
      }

      setIsModalOpen(false);

      showAlert("success", "Berhasil", "Data kendaraan berhasil disimpan.");

      fetchVehicles();
    } catch (error) {
      console.error(error);

      showAlert("error", "Kesalahan", "Gagal menyimpan kendaraan.");
    }
  };

  const reportColumns = [
    {
      header: "Kode Kendaraan",
      accessor: "kode_kendaraan",
    },
    {
      header: "Plat Nomor",
      accessor: "plat_nomor",
    },
    {
      header: "Merk",
      accessor: "merk",
    },
    {
      header: "Tipe",
      accessor: "tipe",
    },
    {
      header: "Tahun",
      accessor: "tahun",
    },
    {
      header: "Warna",
      accessor: "warna",
    },
    {
      header: "Kapasitas",
      accessor: "kapasitas_penumpang",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  const formattedData = filteredVehicles.map((item) => ({
    kode_kendaraan: item.kode_kendaraan,
    plat_nomor: item.plat_nomor,
    merk: item.merk,
    tipe: item.tipe,
    tahun: item.tahun,
    warna: item.warna,
    kapasitas_penumpang: item.kapasitas_penumpang,
    status: item.status,
  }));

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
      )
        return false;

      return range.indexOf(item) === index;
    });
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
            placeholder="Cari Kendaraan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          <div className="flex gap-2">
            <PrintExportModal
              title="Daftar_Kendaraan"
              data={formattedData}
              columns={reportColumns}
            />

            <Button variant="primary" onClick={handleCreate}>
              + Tambah Kendaraan
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-5 py-3">
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Kode
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Plat Nomor
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Merk
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Tipe
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Tahun
                </TableCell>

                <TableCell isHeader className="px-5 py-3">
                  Warna
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-center">
                  Kapasitas
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-center">
                  Status
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-center">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <td
                    colSpan={10}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Memuat data kendaraan...
                  </td>
                </TableRow>
              ) : paginatedVehicles.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={10}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Data kendaraan tidak ditemukan.
                  </td>
                </TableRow>
              ) : (
                paginatedVehicles.map((vehicle, index) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="px-5 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell className="px-5 py-4 font-medium">
                      {vehicle.kode_kendaraan}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      {vehicle.plat_nomor}
                    </TableCell>

                    <TableCell className="px-5 py-4">{vehicle.merk}</TableCell>

                    <TableCell className="px-5 py-4">{vehicle.tipe}</TableCell>

                    <TableCell className="px-5 py-4">{vehicle.tahun}</TableCell>

                    <TableCell className="px-5 py-4">{vehicle.warna}</TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      {vehicle.kapasitas_penumpang}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          vehicle.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(vehicle)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400"
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200 dark:border-white/5">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan{" "}
            <span className="font-semibold">
              {filteredVehicles.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            sampai{" "}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, filteredVehicles.length)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold">{filteredVehicles.length}</span>{" "}
            kendaraan
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ‹
            </Button>

            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 py-2">...</span>
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
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              ›
            </Button>
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 custom-scrollbar">
              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                {editingVehicle ? "Edit Kendaraan" : "Tambah Kendaraan"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Kantor ID */}
                  <div>
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
                  </div>

                  {/* Kode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kode Kendaraan
                    </label>

                    <input
                      type="text"
                      name="kode_kendaraan"
                      value={formData.kode_kendaraan}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Plat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Plat Nomor
                    </label>

                    <input
                      type="text"
                      name="plat_nomor"
                      value={formData.plat_nomor}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Merk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Merk
                    </label>

                    <input
                      type="text"
                      name="merk"
                      value={formData.merk}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Tipe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipe
                    </label>

                    <input
                      type="text"
                      name="tipe"
                      value={formData.tipe}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Tahun */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tahun
                    </label>

                    <input
                      type="number"
                      name="tahun"
                      value={formData.tahun}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Warna */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Warna
                    </label>

                    <input
                      type="text"
                      name="warna"
                      value={formData.warna}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Kapasitas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kapasitas Penumpang
                    </label>

                    <input
                      type="number"
                      name="kapasitas_penumpang"
                      value={formData.kapasitas_penumpang}
                      onChange={handleInputChange}
                      required
                      min={1}
                      className="mt-1 w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-gray-100 bg-white pt-4 dark:border-gray-700 dark:bg-gray-800">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full"
                  >
                    Batal
                  </Button>

                  <Button variant="primary" type="submit" className="w-full">
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
