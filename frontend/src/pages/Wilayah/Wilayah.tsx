import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import WilayahTable from "./components/display/table";

export default function WilayahPage() {
  return (
    <>
      <PageMeta
        title="Wilayah"
        description="Manajemen Wilayah"
      />

      <PageBreadcrumb pageTitle="Data Wilayah" />

      <div className="space-y-6">
        <ComponentCard
          title="Daftar Wilayah"
          desc="Kelola data wilayah operasional perusahaan"
        >
          <WilayahTable />
        </ComponentCard>
      </div>
    </>
  );
}