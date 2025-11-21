import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { ReactNode } from "react";

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

    if (permission && !can(permission)) {
        return <Navigate to="/403" replace />;
    }

    // If component is directly wrapped: <ProtectedRoute>{component}</ProtectedRoute>
    if (children) return <>{children}</>;

    // If used as <Route element={<ProtectedRoute />} />
    return <Outlet />;
}
