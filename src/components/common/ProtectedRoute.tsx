import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { ReactNode, useEffect, useRef } from "react";
import { recordNavigationAuditLog } from "@/database/navigation_audit_logs_api";

interface ProtectedRouteProps {
    permission?: string;
    children?: ReactNode;
}

export default function ProtectedRoute({
    permission,
    children,
}: ProtectedRouteProps) {
    const { user, loading: authLoading } = useAuth();
    const { loading: permLoading, can } = usePermissions();
    const location = useLocation();
    const hasAccess = !permission || can(permission);
    const deniedAuditLoggedRef = useRef(false);

    useEffect(() => {
        if (
            authLoading ||
            permLoading ||
            !user ||
            !permission ||
            hasAccess ||
            deniedAuditLoggedRef.current
        ) {
            return;
        }

        deniedAuditLoggedRef.current = true;

        void recordNavigationAuditLog({
            page: location.pathname,
            method: "GET",
            uri: `${location.pathname}${location.search}`,
            allowed: false,
        });
    }, [
        authLoading,
        permLoading,
        user?.id,
        permission,
        hasAccess,
        location.pathname,
        location.search,
    ]);

    if (authLoading || permLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" replace state={{ from: location }} />;
    }

    if (permission && !hasAccess) {
        return <Navigate to="/403" replace />;
    }

    // If component is directly wrapped: <ProtectedRoute>{component}</ProtectedRoute>
    if (children) return <>{children}</>;

    // If used as <Route element={<ProtectedRoute />} />
    return <Outlet />;
}
