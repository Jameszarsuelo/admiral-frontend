export function resolveAuditPageLabel(pathname: string): string {
    if (!pathname) return "-";

    const normalized = pathname.replace(/\/+$/, "") || "/";

    if (normalized === "/") return "Dashboard";
    if (normalized.startsWith("/overview")) return "Overview";
    if (normalized.startsWith("/workplace")) return "Workplace";
    if (normalized.startsWith("/contact-directory")) return "Contact Directory";
    if (normalized.startsWith("/bordereau-detail")) return "Activity Detail";
    if (normalized.startsWith("/task-detail")) return "Task Detail";
    if (normalized.startsWith("/supplier-directory") || normalized.startsWith("/suppliers")) {
        return "Supplier Directory";
    }
    if (normalized.startsWith("/exceptions")) return "Exceptions";
    if (normalized.startsWith("/upload-exceptions")) return "Upload Exceptions";
    if (normalized.startsWith("/bpc-supplier-skills")) return "BPC Supplier Skills";
    if (normalized.startsWith("/reports")) return "Reports";
    if (normalized.startsWith("/document-management") || normalized.startsWith("/documents")) {
        return "Document Management";
    }
    if (normalized.startsWith("/activity-query-management")) return "Activity Query Management";
    if (normalized.startsWith("/navigation-audit-logs")) return "Navigation Audit Logs";
    if (normalized.startsWith("/system-configurations")) return "System Configurations";
    if (normalized.startsWith("/email-templates")) return "Email Templates";

    return normalized;
}
