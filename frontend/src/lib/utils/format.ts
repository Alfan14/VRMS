export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    dateStyle: "medium",
  });
};

export const formatCurrency = (amount?: number | null): string => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
