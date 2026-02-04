import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierSkillsEditor from "@/components/bpc/SupplierSkillsEditor";

import { fetchBpcById } from "@/database/bpc_api";

export default function BpcSupplierSkillsView() {
    const { id } = useParams();
    const bpcId = Number(id);

    const { data: bpc } = useQuery({
        queryKey: ["bpc", bpcId],
        queryFn: () => fetchBpcById(String(bpcId)),
        enabled: Number.isFinite(bpcId) && bpcId > 0,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });

    const name =
        bpc?.contact
            ? `${bpc.contact.firstname ?? ""} ${bpc.contact.lastname ?? ""}`.trim()
            : "BPC";

    return (
        <>
            <PageBreadcrumb pageTitle="BPC Supplier Skills" />

            <div className="mb-4">
                <Link
                    to=".."
                    className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                >
					Back to BPC list
                </Link>
            </div>

            <SupplierSkillsEditor
                bpcId={Number.isFinite(bpcId) ? bpcId : undefined}
                title={`Supplier Skills (SBR) - ${name}`}
            />
        </>
    );
}
