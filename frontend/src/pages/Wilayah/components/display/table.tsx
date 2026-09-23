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

import { apiClient } from "@/lib/apiClient";
import { hasRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants/roles";

import {
  deleteDataWilayah,
  getDataWilayah,
} from "../endpoint";

import {
  Wilayah,
  WilayahFormData,
  AlertInfo,
} from "../interface";

export default function WilayahTable() {
  const [wilayah, setWilayah] = useState<Wilayah[]>([]);
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

  const [editingWilayah, setEditingWilayah] =
    useState<Wilayah | null>(null);

  const [formData, setFormData] =
    useState<WilayahFormData>({
      kode_wilayah: "",
      nama_wilayah: "",
    });

  const apiUrl = import.meta.env.VITE_API_URL;

  const isAdmin = hasRole([ROLES.ADMIN]);

  const showAlert = (
    variant: "success" | "error" | "warning" | "info",
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
   * Fetch Data
   */
  const fetchWilayah = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDataWilayah("/wilayah");

      const wilayahArray =
        response?.data || response || [];

      setWilayah(
        Array.isArray(wilayahArray)
          ? wilayahArray
          : []
      );
    } catch (error) {
      console.error(
        "Gagal memuat data wilayah:",
        error
      );

      setWilayah([]);

      showAlert(
        "error",
        "Koneksi Gagal",
        "Gagal memuat data wilayah dari server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchWilayah();
    }
  }, [fetchWilayah, isAdmin]);

  /**
   * Client Search
   */
  const filteredWilayah = useMemo(() => {
    return wilayah.filter((item) => {
      const search = searchQuery.toLowerCase();

      return (
        item.kode_wilayah
          .toLowerCase()
          .includes(search) ||
        item.nama_wilayah
          .toLowerCase()
          .includes(search)
      );
    });
  }, [wilayah, searchQuery]);

  /**
   * Client Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredWilayah.length / itemsPerPage)
  );

  const paginatedWilayah = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredWilayah.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredWilayah,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Create
   */
  const handleCreate = () => {
    setEditingWilayah(null);

    setFormData({
      kode_wilayah: "",
      nama_wilayah: "",
    });

    setIsModalOpen(true);
  };

  /**
   * Edit
   */
  const handleEdit = (
    item: Wilayah
  ) => {
    setEditingWilayah(item);

    setFormData({
      kode_wilayah: item.kode_wilayah,
      nama_wilayah: item.nama_wilayah,
    });

    setIsModalOpen(true);
  };

  /**
   * Delete
   */
  const handleDelete = async (
    id: string
  ) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus wilayah ini?"
      )
    ) {
      try {
        await deleteDataWilayah(
          `/wilayah/${id}`
        );

        showAlert(
          "success",
          "Berhasil!",
          "Wilayah berhasil dihapus."
        );

        fetchWilayah();
      } catch (error) {
        console.error(error);

        showAlert(
          "error",
          "Gagal Menghapus",
          "Terjadi kesalahan saat menghapus data."
        );
      }
    }
  };

  /**
   * Input Change
   */
  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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
  const handlePageChange = (
    page: number
  ) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  /**
   * Submit
   */
  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      if (editingWilayah) {
        await apiClient.put(
          `/wilayah/${editingWilayah.id}`,
          formData
        );
      } else {
        await apiClient.post(
          "/wilayah",
          formData
        );
      }

      setIsModalOpen(false);

      showAlert(
        "success",
        "Berhasil!",
        `Wilayah ${formData.kode_wilayah} berhasil disimpan.`
      );

      fetchWilayah();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Kesalahan Jaringan",
        "Tidak dapat terhubung ke server."
      );
    }
  };

  /**
   * Pagination Number Generator
   */
  const getPaginationRange = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const delta = 2;
    const range: (number | string)[] =
      [];

    for (
      let i = Math.max(
        2,
        currentPage - delta
      );
      i <=
      Math.min(
        totalPages - 1,
        currentPage + delta
      );
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2)
      range.unshift("...");

    if (currentPage - delta >= 2)
      range.unshift(1);

    if (
      currentPage + delta <
      totalPages - 1
    )
      range.push("...");

    if (
      currentPage + delta <=
      totalPages - 1
    )
      range.push(totalPages);

    if (range[0] !== 1)
      range.unshift(1);

    if (
      range[range.length - 1] !==
      totalPages
    )
      range.push(totalPages);

    return range.filter(
      (item, index) => {
        if (
          item === "..." &&
          (index === 0 ||
            index ===
              range.length - 1 ||
            range[index - 1] === "...")
        )
          return false;

        return (
          range.indexOf(item) ===
          index
        );
      }
    );
  };

  /**
   * Export Data
   */
  const reportColumns = [
    {
      header: "Kode Wilayah",
      accessor: "kode_wilayah",
    },
    {
      header: "Nama Wilayah",
      accessor: "nama_wilayah",
    },
  ];

  const formattedData =
    filteredWilayah.map((item) => ({
      kode_wilayah:
        item.kode_wilayah,
      nama_wilayah:
        item.nama_wilayah,
    }));

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
          document.body
        )}

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Wilayah..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <PrintExportModal
              title="Daftar_Wilayah"
              data={formattedData}
              columns={reportColumns}
            />

            {isAdmin && (
              <Button
                variant="primary"
                onClick={handleCreate}
              >
                + Tambah Wilayah
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                >
                  No.
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                >
                  Kode Wilayah
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                >
                  Nama Wilayah
                </TableCell>

                {isAdmin && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs"
                  >
                    Aksi
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </TableRow>
              ) : paginatedWilayah.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Data wilayah tidak ditemukan.
                  </td>
                </TableRow>
              ) : (
                paginatedWilayah.map(
                  (item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                        {(currentPage - 1) *
                          itemsPerPage +
                          index +
                          1}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.kode_wilayah}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {item.nama_wilayah}
                      </TableCell>

                      {isAdmin && (
                        <TableCell className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEdit(item)
                              }
                              className="px-3 py-1"
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDelete(item.id)
                              }
                              className="px-3 py-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )
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
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredWilayah.length === 0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            hingga{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredWilayah.length
              )}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredWilayah.length}
            </span>{" "}
            wilayah
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
              disabled={currentPage === 1}
              className="px-3"
            >
              ‹
            </Button>

            {getPaginationRange(
              currentPage,
              totalPages
            ).map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 py-2 text-gray-400 select-none">
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
                    className={`min-w-10 ${
                      currentPage === page
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="px-3"
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
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 custom-scrollbar">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {editingWilayah
                  ? "Edit Wilayah"
                  : "Tambah Wilayah"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kode Wilayah
                  </label>

                  <input
                    type="text"
                    name="kode_wilayah"
                    value={formData.kode_wilayah}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Contoh: KALBAR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Wilayah
                  </label>

                  <textarea
                    name="nama_wilayah"
                    value={formData.nama_wilayah}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 w-full rounded-md border p-2 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Contoh: Kalimantan Barat"
                  />
                </div>

                <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-gray-100 bg-white pt-4 dark:border-gray-700 dark:bg-gray-800">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setIsModalOpen(false)
                    }
                    className="w-full"
                  >
                    Batal
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                  >
                    Simpan
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