import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Spinner from "./components/ui/spinner/Spinner";

// Lazy load pages
const Home = lazy(() => import("./pages-backup/Dashboard/Home"));
const IPCView = lazy(
    () => import("./pages/SystemConfigurations/InvoicePaymentClerks/IPCView"),
);
const IPCForm = lazy(() =>
    import("./pages/SystemConfigurations/InvoicePaymentClerks/IPCForm").then(
        (module) => ({ default: module.IPCForm }),
    ),
);
const SupplierView = lazy(
    () => import("./pages/SystemConfigurations/Suppliers/SupplierView"),
);
const SupplierForm = lazy(() =>
    import("./pages/SystemConfigurations/Suppliers/SupplierForm").then(
        (module) => ({ default: module.SupplierForm }),
    ),
);
const UserView = lazy(
    () => import("./pages/SystemConfigurations/Users/UserView"),
);
const UserForm = lazy(() =>
    import("./pages/SystemConfigurations/Users/UserForm").then((module) => ({
        default: module.UserForm,
    })),
);
const PlanningForm = lazy(() =>
    import("./pages/SystemConfigurations/Planning/PlanningForm").then(
        (module) => ({ default: module.PlanningForm }),
    ),
);
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

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
                        {/* Dashboard Layout */}
                        <Route element={<AppLayout />}>
                            <Route index path="/" element={<Home />} />

                            {/* Configurations */}
                            <Route
                                index
                                path="/invoice-payment-clerk"
                                element={<IPCView />}
                            />
                            <Route
                                path="/invoice-payment-clerk/:method/:id?"
                                element={<IPCForm />}
                            />

                            <Route
                                path="/suppliers"
                                element={<SupplierView />}
                            />

                            <Route
                                path="/suppliers/:method/:id?"
                                element={<SupplierForm />}
                            />

                            <Route path="/users" element={<UserView />} />

                            <Route
                                path="/users/:method/:id?"
                                element={<UserForm />}
                            />

                            <Route
                                path="/planning"
                                element={<PlanningForm />}
                            />


                            {/* Others Page */}
                            {/* <Route path="/profile" element={<UserProfiles />} /> */}
                            {/* <Route path="/calendar" element={<Calendar />} />
                            <Route path="/blank" element={<Blank />} /> */}

                            {/* Forms */}
                            <Route
                                path="/form-elements"
                                element={<FormElements />}
                            />

                            {/* Tables */}
                            {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

                            {/* Ui Elements */}
                            {/* <Route path="/alerts" element={<Alerts />} />
                            <Route path="/avatars" element={<Avatars />} />
                            <Route path="/badge" element={<Badges />} />
                            <Route path="/buttons" element={<Buttons />} />
                            <Route path="/images" element={<Images />} />
                            <Route path="/videos" element={<Videos />} /> */}

                            {/* Charts */}
                            {/* <Route path="/line-chart" element={<LineChart />} />
                            <Route path="/bar-chart" element={<BarChart />} /> */}
                        </Route>

                        {/* Auth Layout */}
                        {/* <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} /> */}

                        {/* Fallback Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Router>
        </>
    );
}
