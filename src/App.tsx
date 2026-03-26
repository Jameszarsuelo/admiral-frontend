import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Spinner from "./components/ui/spinner/Spinner";
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { UnauthenticatedRoutes } from "./routes/UnauthenticatedRoutes";
import { useAuth } from "./hooks/useAuth";
import { recordNavigationAuditLog } from "./database/navigation_audit_logs_api";
import { resolveAuditPageLabel } from "./lib/navigationAudit";



// Loading fallback component
const PageLoader = () => (
    <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
    </div>
);

// Global listener to record page views on route changes for authenticated users.
function NavigationAuditListener() {
    const location = useLocation();
    const { user } = useAuth();
    const lastPathRef = useRef<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const key = `${location.pathname}${location.search}`;
        if (lastPathRef.current === key) return;
        lastPathRef.current = key;

        void recordNavigationAuditLog({
            page: resolveAuditPageLabel(location.pathname),
            method: "GET",
            uri: key,
            allowed: true,
        });
    }, [location.pathname, location.search, user?.id]);

    return null;
}

export default function App() {
    return (
        <>
            <Router>
                <ScrollToTop />
                <NavigationAuditListener />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {AuthenticatedRoutes()}

                        {UnauthenticatedRoutes()}
                    </Routes>
                </Suspense>
            </Router>
        </>
    );
}
