"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect, useMemo, useCallback } from "react";
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
import { getUsers, createUser, updateUser, deleteUser, UserPayload } from "@/services/users";
import { ROLE_OPTIONS, UserRole, ROLES } from "@/lib/constants/roles";
import { User } from "@/types/api";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<UserPayload>({ 
    username: "",
    password: "",
    pin: "",
    role: ROLES.kasir,
  });

  const showAlert = (variant: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setAlertInfo({ show: true, variant, title, message });
    setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsers(); 
      const usersArray = response?.data || response || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (error) {
      console.error("Gagal memuat user:", error);
      setUsers([]);
      showAlert("error", "Koneksi Gagal", "Gagal memuat data user dari server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const searchMatch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = roleFilter ? u.role === roleFilter : true;
      return searchMatch && roleMatch;
    });
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: "", password: "", pin: "", role: ROLES.kasir });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      username: user.username, 
      role: user.role,
      password: "",
      pin: "" 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        await deleteUser(id);
        showAlert("success", "Berhasil!", "User berhasil dihapus.");
        fetchUsers(); 
      } catch (error: any) {
        console.error(error);
        showAlert("error", "Gagal Menghapus", error.response?.data?.message || "Terjadi kesalahan saat menghapus data di server.");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Create payload
    const payload: UserPayload = {
      username: formData.username,
      role: formData.role,
      password: formData.password || "",
      pin: formData.pin || "",
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(payload);
      }

      setIsModalOpen(false);
      showAlert("success", "Berhasil!", `User ${formData.username} berhasil disimpan.`);
      fetchUsers(); 
    } catch (error: any) {
      console.error("Failed to save user:", error);
      showAlert("error", "Gagal Menyimpan", error.response?.data?.message || "Pastikan semua data diisi dengan benar.");
    }
  };

  const getPaginationRange = (currentPage: number, totalPages: number): (number | string)[] => {
    const delta = 2; 
    const range: (number | string)[] = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage - delta >= 2) range.unshift(1);
    if (currentPage + delta < totalPages - 1) range.push('...');
    if (currentPage + delta <= totalPages - 1) range.push(totalPages);
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] !== totalPages) range.push(totalPages);
    return range.filter((item, index) => {
      if (item === '...' && (index === 0 || index === range.length - 1 || range[index - 1] === '...')) return false;
      return range.indexOf(item) === index;
    });
  };

  return (
    <div className="space-y-4 relative">
      
      {alertInfo.show && createPortal(
        <div className="fixed top-6 right-6 z-[999999] w-full max-w-sm drop-shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-5">
          <Alert 
            variant={alertInfo.variant} 
            title={alertInfo.title} 
            message={alertInfo.message} 
          />
        </div>,
        document.body
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Semua Role</option>
              {ROLE_OPTIONS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="primary" onClick={handleCreate}>+ Tambah User</Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">No.</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">Username</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Memuat data...</td>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    Data user tidak ditemukan.
                  </td>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider
                        ${user.role === ROLES.superadmin ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${user.role === ROLES.admin ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${user.role === ROLES.manager ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                        ${user.role === ROLES.kasir ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}
                      `}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)} className="px-3 py-1">Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)} className="px-3 py-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200 dark:border-white/5">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan <span className="font-semibold text-gray-900 dark:text-white">
              {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span> hingga <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span> dari <span className="font-semibold text-gray-900 dark:text-white">
              {filteredUsers.length}
            </span> user
          </div>

          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3">‹</Button>
            
            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-2 text-gray-400 select-none">...</span>
                ) : (
                  <Button
                    size="sm" variant={currentPage === page ? "primary" : "outline"}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-10 ${currentPage === page ? 'font-semibold' : ''}`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button size="sm" variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3">›</Button>
          </div>
        </div>
      )}

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 custom-scrollbar">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {editingUser ? "Edit User" : "Tambah User"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Username"
                  className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>Pilih Role</option>
                  {ROLE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password {editingUser && <span className="text-gray-400 text-xs">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required={!editingUser} 
                  placeholder="Password"
                  className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  PIN {editingUser && <span className="text-gray-400 text-xs">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input 
                  type="password" 
                  name="pin" 
                  value={formData.pin} 
                  onChange={handleInputChange} 
                  required={!editingUser} 
                  placeholder="PIN 4 digit"
                  className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
              </div>
              
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 mt-6 flex gap-3 border-t border-gray-100 dark:border-gray-700">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="w-full">Batal</Button>
                <Button variant="primary" type="submit" className="w-full">Simpan</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
