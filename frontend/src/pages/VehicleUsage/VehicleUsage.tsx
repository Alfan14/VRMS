import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VehicleUsageTable from "./components/display/table";

export default function VehicleUsagePage() {
  return (
    <>
      <PageMeta
        title="Vehicle Usage"
        description="Vehicle Usage Management"
      />

      <PageBreadcrumb pageTitle="Vehicle Usage" />

      <div className="space-y-6">
        <ComponentCard title="Vehicle Usage Table">
          <VehicleUsageTable />
        </ComponentCard>
      </div>
    </>
  );
}