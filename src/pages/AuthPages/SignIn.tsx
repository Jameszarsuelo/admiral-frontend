import { Navigate, useLocation } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/spinner/Spinner";
import { usePermissions } from "@/hooks/usePermissions";

export default function SignIn() {
    const { user, loading } = useAuth();
    const { modules } = usePermissions();
    const location = useLocation();

    // Show nothing while checking auth state (prevents flash)
    if (loading) {
        return (
            <Spinner
                size="lg"
                className="flex h-screen items-center justify-center"
            />
        );
    }
    // If already logged in, redirect appropriately.
    // For workplace users (user_type_id === 3) always send to `/workplace`.
    if (user) {
        if (user.user_type_id === 3) {
            return <Navigate to="/workplace" replace />;
        }

        const locState = (
            location as unknown as {
                state?: { from?: { pathname?: string } };
            }
        )?.state;
        const from = locState?.from?.pathname;

        const dest = from || modules[0]?.path || "/";
        return <Navigate to={dest} replace />;
    }

    return (
        <>
            <PageMeta
                title="Alloc8"
                description="Alloc8 is a powerful platform for managing and orchestrating your containerized applications with ease."
            />
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </>
    );
}
