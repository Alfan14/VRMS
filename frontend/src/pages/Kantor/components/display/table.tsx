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
  getDataKantor,
  postDataKantor,
  putDataKantor,
  deleteDataKantor,
} from "../endpoint";

import {
  Kantor,
  KantorFormData,
  Wilayah,
  AlertInfo,
} from "../interface";

import { apiClient } from "@/lib/apiClient";
import { getUserRole } from "@/lib/auth";

export default function KantorTable() {
  const role = getUserRole();

  const canManage =
    role === "ADMIN" ||
    role === "KEPALA_OPERASIONAL";

  const [kantor, setKantor] = useState<Kantor[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingKantor, setEditingKantor] =
    useState<Kantor | null>(null);

  const [formData, setFormData] =
    useState<KantorFormData>({
      wilayah_id: "",
      kode_kantor: "",
      nama_kantor: "",
      alamat: "",
    });

  const [alertInfo, setAlertInfo] =
    useState<AlertInfo>({
      show: false,
      variant: "success",
      title: "",
      message: "",
    });

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
      setAlertInfo((prev:any) => ({
        ...prev,
        show: false,
      }));
    }, 5000);
  };

  const fetchKantor = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await getDataKantor("/kantor");

      setKantor(response.data || []);
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Gagal",
        "Gagal memuat data kantor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWilayah = useCallback(async () => {
    try {
      const response =
        await apiClient.get("/wilayah");

      setWilayahList(response.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchKantor();
    fetchWilayah();
  }, [fetchKantor, fetchWilayah]);

  const filteredData = useMemo(() => {
    const search = searchQuery.toLowerCase();

    return kantor.filter((item) => {
      return (
        item.kode_kantor
          ?.toLowerCase()
          .includes(search) ||
        item.nama_kantor
          ?.toLowerCase()
          .includes(search) ||
        item.alamat
          ?.toLowerCase()
          .includes(search) ||
        item.wilayah?.nama_wilayah
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [kantor, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / itemsPerPage)
  );

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return filteredData.slice(
      start,
      start + itemsPerPage
    );
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreate = () => {
    setEditingKantor(null);

    setFormData({
      wilayah_id: "",
      kode_kantor: "",
      nama_kantor: "",
      alamat: "",
    });

    setIsModalOpen(true);
  };

  const handleEdit = (item: Kantor) => {
    setEditingKantor(item);

    setFormData({
      wilayah_id: item.wilayah_id,
      kode_kantor: item.kode_kantor,
      nama_kantor: item.nama_kantor,
      alamat: item.alamat,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Yakin hapus kantor ini?"
      )
    )
      return;

    try {
      await deleteDataKantor(
        `/kantor/${id}`
      );

      showAlert(
        "success",
        "Berhasil",
        "Kantor berhasil dihapus"
      );

      fetchKantor();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      if (editingKantor) {
        await putDataKantor(
          `/kantor/${editingKantor.id}`,
          formData
        );
      } else {
        await postDataKantor(
          "/kantor",
          formData
        );
      }

      setIsModalOpen(false);

      fetchKantor();

      showAlert(
        "success",
        "Berhasil",
        "Data kantor berhasil disimpan"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reportColumns = [
    {
      header: "Kode",
      accessor: "kode_kantor",
    },
    {
      header: "Nama Kantor",
      accessor: "nama_kantor",
    },
    {
      header: "Wilayah",
      accessor: "wilayah",
    },
    {
      header: "Alamat",
      accessor: "alamat",
    },
  ];

  const exportData = filteredData.map(
    (item) => ({
      kode_kantor: item.kode_kantor,
      nama_kantor: item.nama_kantor,
      wilayah:
        item.wilayah?.nama_wilayah || "-",
      alamat: item.alamat,
    })
  );

  return (
    <div className="space-y-4">

      {alertInfo.show &&
        createPortal(
          <div className="fixed top-6 right-6 z-[999999] w-full max-w-sm">
            <Alert {...alertInfo} />
          </div>,
          document.body
        )}

      <div className="flex flex-col sm:flex-row justify-between gap-3">

        <input
          type="text"
          placeholder="Cari Kantor..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="w-full sm:w-72 px-3 py-2 border rounded-lg"
        />

        <div className="flex gap-2">

          <PrintExportModal
            title="Daftar_Kantor"
            data={exportData}
            columns={reportColumns}
          />

          {canManage && (
            <Button
              variant="primary"
              onClick={handleCreate}
            >
              + Tambah Kantor
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">

        <div className="max-w-full overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>
                <TableCell isHeader>No</TableCell>
                <TableCell isHeader>Kode</TableCell>
                <TableCell isHeader>Nama Kantor</TableCell>
                <TableCell isHeader>Wilayah</TableCell>
                <TableCell isHeader>Alamat</TableCell>
                {canManage && (
                  <TableCell isHeader>
                    Aksi
                  </TableCell>
                )}
              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (
                <TableRow>
                  <td
                    colSpan={
                      canManage ? 6 : 5
                    }
                    className="text-center py-8"
                  >
                    Memuat Data...
                  </td>
                </TableRow>
              ) : (
                paginatedData.map(
                  (item, index) => (
                    <TableRow key={item.id}>

                      <TableCell>
                        {(currentPage - 1) *
                          itemsPerPage +
                          index +
                          1}
                      </TableCell>

                      <TableCell>
                        {item.kode_kantor}
                      </TableCell>

                      <TableCell>
                        {item.nama_kantor}
                      </TableCell>

                      <TableCell>
                        {item.wilayah
                          ?.nama_wilayah}
                      </TableCell>

                      <TableCell>
                        {item.alamat}
                      </TableCell>

                      {canManage && (
                        <TableCell>

                          <div className="flex gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
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

      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                {editingKantor
                  ? "Edit Kantor"
                  : "Tambah Kantor"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <select
                  name="wilayah_id"
                  value={
                    formData.wilayah_id
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                  className="w-full border rounded-md p-2"
                >
                  <option value="">
                    Pilih Wilayah
                  </option>

                  {wilayahList.map(
                    (wilayah) => (
                      <option
                        key={wilayah.id}
                        value={wilayah.id}
                      >
                        {
                          wilayah.nama_wilayah
                        }
                      </option>
                    )
                  )}
                </select>

                <input
                  name="kode_kantor"
                  value={
                    formData.kode_kantor
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Kode Kantor"
                  required
                  className="w-full border rounded-md p-2"
                />

                <input
                  name="nama_kantor"
                  value={
                    formData.nama_kantor
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Nama Kantor"
                  required
                  className="w-full border rounded-md p-2"
                />

                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Alamat"
                  rows={3}
                  required
                  className="w-full border rounded-md p-2"
                />

                <div className="flex gap-3">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setIsModalOpen(false)
                    }
                    className="w-full"
                  >
                    Batal
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
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