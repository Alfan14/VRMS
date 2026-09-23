import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ReservationTable from "./components/display/table";

export default function ReservationsPage() {
  return (
    <>
      <PageMeta 
        title="Reservations"
        description="Vehicle Reservation Management"
      />

      <PageBreadcrumb pageTitle="Reservations Page" />

      <div className="space-y-6">
        <ComponentCard title="Reservations Table">
          <ReservationTable />
        </ComponentCard>
      </div>
    </>
  );
}