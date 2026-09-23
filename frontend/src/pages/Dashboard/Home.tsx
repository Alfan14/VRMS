import { Component, useEffect, useState } from "react";
import {
  Car,
  CheckCircle,
  ClipboardList,
  Fuel,
  RefreshCw,
  Clock3,
  Wrench,
  XCircle,
} from "lucide-react";

import PageMeta from "../../components/common/PageMeta";
import { apiClient } from "@/lib/apiClient";

type DashboardSummary = {
  vehicles: {
    total: number;
    available: number;
    in_use: number;
    service: number;
  };
  reservations: {
    total: number;
    pending_lv1: number;
    pending_lv2: number;
    approved: number;
    rejected: number;
  };
  fuel: {
    total_records: number;
    total_liter: string;
    total_cost: string;
  };
  services: {
    scheduled: number;
    completed: number;
  };
};

interface DashboardResponse {
  success: boolean;
  data: DashboardSummary;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-6">
          <p className="text-error-600 font-medium">
            Terjadi kesalahan saat memuat dashboard.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900">
      <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="mt-4 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

const formatCurrency = (value: string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));

export default function Home() {
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/dashboard/summary")
      .then((response: DashboardResponse) => {
        if (!cancelled) {
          setStats(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Gagal memuat dashboard.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="Dashboard | Vehicle Reservation System"
        description="Dashboard Vehicle Reservation System"
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ringkasan kendaraan, reservasi, BBM dan service.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-error-200 bg-error-50 p-6">
            <p className="text-error-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
            >
              <RefreshCw className="h-4 w-4" />
              Muat Ulang
            </button>
          </div>
        )}

        {!loading && stats && (
          <ErrorBoundary>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                label="Total Kendaraan"
                value={stats.vehicles.total}
                icon={<Car className="h-6 w-6 text-white" />}
                iconBg="bg-blue-500"
              />

              <StatCard
                label="Kendaraan Tersedia"
                value={stats.vehicles.available}
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                iconBg="bg-green-500"
              />

              <StatCard
                label="Total Reservasi"
                value={stats.reservations.total}
                icon={<ClipboardList className="h-6 w-6 text-white" />}
                iconBg="bg-purple-500"
              />

              <StatCard
                label="Total Biaya BBM"
                value={formatCurrency(stats.fuel.total_cost)}
                icon={<Fuel className="h-6 w-6 text-white" />}
                iconBg="bg-orange-500"
              />

              <StatCard
                label="Pending Approval LV1"
                value={stats.reservations.pending_lv1}
                icon={<Clock3 className="h-6 w-6 text-white" />}
                iconBg="bg-yellow-500"
              />

              <StatCard
                label="Pending Approval LV2"
                value={stats.reservations.pending_lv2}
                icon={<Clock3 className="h-6 w-6 text-white" />}
                iconBg="bg-amber-600"
              />

              <StatCard
                label="Reservasi Approved"
                value={stats.reservations.approved}
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                iconBg="bg-green-600"
              />

              <StatCard
                label="Reservasi Rejected"
                value={stats.reservations.rejected}
                icon={<XCircle className="h-6 w-6 text-white" />}
                iconBg="bg-red-600"
              />

              <StatCard
                label="Kendaraan Digunakan"
                value={stats.vehicles.in_use}
                icon={<Car className="h-6 w-6 text-white" />}
                iconBg="bg-indigo-500"
              />

              <StatCard
                label="Dalam Service"
                value={stats.vehicles.service}
                icon={<Wrench className="h-6 w-6 text-white" />}
                iconBg="bg-red-500"
              />

              <StatCard
                label="Service Terjadwal"
                value={stats.services.scheduled}
                icon={<Wrench className="h-6 w-6 text-white" />}
                iconBg="bg-cyan-500"
              />

              <StatCard
                label="Service Selesai"
                value={stats.services.completed}
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                iconBg="bg-emerald-500"
              />

            </div>
          </ErrorBoundary>
        )}
      </div>
    </>
  );
}