import { Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/spinner/Spinner";

export default function SignIn() {
  const { user, loading } = useAuth();

  // Show nothing while checking auth state (prevents flash)
  if (loading) {
    return <Spinner size="lg" className="flex h-screen items-center justify-center" />;
  }

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageMeta
        title="Admiral"
        description="Admiral is a powerful platform for managing and orchestrating your containerized applications with ease."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
