import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VehicleTable from "./components/display/table";

export default function VehiclePage() {
  return (
    <>
      <PageMeta
        title="Vehicles"
        description="This is Vehicles Page"
      />

      <PageBreadcrumb pageTitle="Vehicles Page" />

      <div className="space-y-6">
        <ComponentCard title="Vehicles Table">
          <VehicleTable />
        </ComponentCard>
      </div>
    </>
  );
}