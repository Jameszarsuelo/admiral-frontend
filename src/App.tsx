import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense } from "react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Spinner from "./components/ui/spinner/Spinner";
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { UnauthenticatedRoutes } from "./routes/UnauthenticatedRoutes";



// Loading fallback component
const PageLoader = () => (
    <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
    </div>
);

export default function App() {
    return (
        <>
            <Router>
                <ScrollToTop />
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
