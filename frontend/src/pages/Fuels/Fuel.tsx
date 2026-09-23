import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import FuelTable from "./components/display/table";

export default function FuelPage() {
  return (
    <>
      <PageMeta
        title="Fuel Records"
        description="Fuel Records Management"
      />

      <PageBreadcrumb pageTitle="Fuel Records" />

      <div className="space-y-6">
        <ComponentCard title="Fuel Records Table">
          <FuelTable />
        </ComponentCard>
      </div>
    </>
  );
}