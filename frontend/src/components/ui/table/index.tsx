import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  title?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <table className={`min-w-full border-collapse ${className}`}>
      {children}
    </table>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
  return (
    <thead
      className={`border-b border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.02] ${className}`}
    >
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
  return (
    <tbody
      className={`divide-y divide-gray-100 dark:divide-white/[0.05] ${className}`}
    >
      {children}
    </tbody>
  );
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] ${className}`}>
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
  title,
}) => {
  const CellTag = isHeader ? "th" : "td";

  const baseStyle = isHeader? "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 whitespace-nowrap" : "px-4 py-3 text-sm text-gray-700 dark:text-gray-300 align-middle";

  return <CellTag className={`${baseStyle} ${className}`} title={title}>
    {children}
  </CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };