import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ApprovalTable from "./components/display/ApprovalTable";

import { APPROVAL_LEVEL_1 } from "./components/constants";

export default function ApprovalLevel1Page() {
  return (
    <>
      <PageMeta
        title="Approval Level 1"
        description="Approval Level 1"
      />

      <PageBreadcrumb pageTitle="Approval Level 1" />

      <div className="space-y-6">
        <ComponentCard title="Pending Approval Level 1">
          <ApprovalTable level={APPROVAL_LEVEL_1} />
        </ComponentCard>
      </div>
    </>
  );
}