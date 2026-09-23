import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VehicleTable from "./components/display/table";

export default function KantorPage() {
  return (
    <>
      <PageMeta
        title="Kantor"
        description="This is Kantor Page"
      />

      <PageBreadcrumb pageTitle="Kantor Page" />

      <div className="space-y-6">
        <ComponentCard title="Kantor Table">
          <VehicleTable />
        </ComponentCard>
      </div>
    </>
  );
}