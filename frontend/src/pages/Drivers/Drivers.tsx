import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import DriversTable from "./components/display/table";

export default function DriversPage() {
  return (
    <>
      <PageMeta
        title="Drivers"
        description="Drivers Management Page"
      />

      <PageBreadcrumb pageTitle="Drivers" />

      <div className="space-y-6">
        <ComponentCard title="Drivers Table">
          <DriversTable />
        </ComponentCard>
      </div>
    </>
  );
}