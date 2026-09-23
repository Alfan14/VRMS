import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsersTable from "./components/display/table";

export default function UsersPage() {
  return (
    <>
      <PageMeta
        title="Users Management"
        description="This is Users Management Page"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users List">
          <UsersTable />
        </ComponentCard>
      </div>
    </>
  );
}
