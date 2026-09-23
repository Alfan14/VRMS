import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ApprovalTable from "./components/display/ApprovalTable";

import { APPROVAL_LEVEL_2 } from "./components/constants";

export default function ApprovalLevel2Page() {
  return (
    <>
      <PageMeta
        title="Approval Level 2"
        description="Approval Level 2"
      />
      <PageBreadcrumb pageTitle="Approval Level 2" />

      <div className="space-y-6">
        <ComponentCard title="Pending Approval Level 2">
          <ApprovalTable level={APPROVAL_LEVEL_2} />
        </ComponentCard>
      </div>
    </>
  );
}