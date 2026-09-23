"use client";

import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface User {
  image: string;
  name: string;
  role: string;
}

interface Team {
  images: string[];
}

export interface Order {
  id: number;
  user: User;
  projectName: string;
  team: Team;
  status: "Active" | "Pending" | "Cancel";
  budget: string;
}

interface OrderFormData {
  user: { 
    image: string; 
    name: string; 
    role: string 
  };
  projectName: string;
  team: { 
    images: string[] 
  };
  status: "Active" | "Pending" | "Cancel";
  budget: string;
}

const initialData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

// ─────────────────────────────────────────────────────────────
// Helper: Badge Color Mapper (FIXED: removed "default")
// ─────────────────────────────────────────────────────────────
const getStatusColor = (status: Order["status"]): "success" | "warning" | "error" => {
  switch (status) {
    case "Active":
      return "success";
    case "Pending":
      return "warning";
    case "Cancel":
      return "error";
    default:
      return "warning"; // Fallback to valid color
  }
};

export default function BasicTableOne() {
  const [orders, setOrders] = useState<Order[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    user: { image: "", name: "", role: "" },
    projectName: "",
    team: { images: [] },
    status: "Pending",
    budget: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ─── Filtered & Paginated Data ───
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // ─── CRUD Handlers ───
  const handleCreate = () => {
    setEditingOrder(null);
    setFormData({
      user: { image: "", name: "", role: "" },
      projectName: "",
      team: { images: [] },
      status: "Pending",
      budget: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      user: { ...order.user },
      projectName: order.projectName,
      team: { ...order.team },
      status: order.status,
      budget: order.budget,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
  };

  // FIXED: Added proper event type
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id
            ? { ...order, ...formData }
            : order
        )
      );
    } else {
      const newOrder: Order = {
        id: Math.max(...orders.map((o) => o.id), 0) + 1,
        ...formData,
      };
      setOrders((prev) => [...prev, newOrder]);
    }
    setIsModalOpen(false);
  };

  // FIXED: Added proper event type
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        user: { ...prev.user, [field]: value },
      }));
    } else if (name.startsWith("team.")) {
      setFormData((prev) => ({
        ...prev,
        team: { images: value.split(",").map((img) => img.trim()) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ─── Render ───
  return (
    <div className="space-y-4">
      {/* Header: Search + Create Button */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* FIXED: Native input instead of missing Input component */}
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <Button variant="primary" onClick={handleCreate}>
          + Add Order
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Project Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Team</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Budget</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedOrders.length === 0 ? (
                // FIXED: colSpan as native HTML attribute
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No orders found. {searchQuery && "Try adjusting your search."}
                  </td>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    {/* User Column */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
                          {order.user.image ? (
                            <img
                              width={40}
                              height={40}
                              src={order.user.image}
                              alt={order.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                          )}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {order.user.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {order.user.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Project Name */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.projectName}
                    </TableCell>

                    {/* Team Avatars */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {order.team.images.slice(0, 3).map((teamImage, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900 bg-gray-100"
                          >
                            <img
                              width={24}
                              height={24}
                              src={teamImage}
                              alt={`Team ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.team.images.length > 3 && (
                          <div className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-100 border-2 border-white rounded-full dark:border-gray-900">
                            +{order.team.images.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* Budget */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.budget}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(order)}
                          className="px-2 py-1"
                        >
                          Edit
                        </Button>
                        {/* FIXED: Changed variant from "danger" to "outline" + red text */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(order.id)}
                          className="px-2 py-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
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
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages} ({filteredOrders.length} total)
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "primary" : "outline"}
                onClick={() => handlePageChange(page)}
                className="min-w-8"
              >
                {page}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* FIXED: Modal using conditional rendering instead of missing Modal component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl dark:bg-gray-800 border border-gray-200 dark:border-white/5">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingOrder ? "Edit Order" : "Create New Order"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* User Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">User Name *</label>
                  <input
                    name="user.name"
                    value={formData.user.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">User Role *</label>
                  <input
                    name="user.role"
                    value={formData.user.role}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">User Image URL</label>
                  <input
                    name="user.image"
                    value={formData.user.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Project Section */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Project Name *</label>
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Team Section */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Team Images (comma-separated URLs)</label>
                <input
                  name="team.images"
                  value={formData.team.images.join(", ")}
                  onChange={handleInputChange}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Status & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Budget *</label>
                  <input
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5.2K"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer - FIXED: Removed type prop, used onClick */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 dark:border-white/5">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  // Trigger form submit manually since we removed type="submit"
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
              >
                {editingOrder ? "Update Order" : "Create Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}