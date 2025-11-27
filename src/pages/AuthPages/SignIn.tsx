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
    // Non-intrusive rule: if the user "landed" on the sign-in page (no `from`),
    // and they are a workplace user (user_type_id === 3), send them to `/workplace`.
    if (user) {
        const locState = (
            location as unknown as {
                state?: { from?: { pathname?: string } };
            }
        )?.state;
        const from = locState?.from?.pathname;

        const landedOnSignIn = !from || from === "/signin";

        if (user.user_type_id === 3 && landedOnSignIn) {
            return <Navigate to="/workplace" replace />;
        }

        const dest = from || modules[0]?.path || "/";
        return <Navigate to={dest} replace />;
    }

    return (
        <>
            <PageMeta
                title="Admiral IPT"
                description="Admiral is a powerful platform for managing and orchestrating your containerized applications with ease."
            />
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </>
    );
}
