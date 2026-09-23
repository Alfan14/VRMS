import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ServicesTable from "./components/display/table";

export default function ServicesPage() {
  return (
    <>
      <PageMeta
        title="Vehicle Services"
        description="Vehicle Service Management"
      />

      <PageBreadcrumb pageTitle="Vehicle Services" />

      <div className="space-y-6">
        <ComponentCard title="Vehicle Services Table">
          <ServicesTable />
        </ComponentCard>
      </div>
    </>
  );
}