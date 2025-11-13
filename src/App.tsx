import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Spinner from "./components/ui/spinner/Spinner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";

// Lazy load pages
const Home = lazy(() => import("./pages-backup/Dashboard/Home"));
const IPCView = lazy(
    () => import("./pages/SystemConfigurations/InvoicePaymentClerks/IPCView"),
);
const IPCForm = lazy(
    () => import("./pages/SystemConfigurations/InvoicePaymentClerks/IPCForm"),
);
const SupplierView = lazy(
    () => import("./pages/SupplierDirectory/SupplierView"),
);
const SupplierForm = lazy(
    () => import("./pages/SupplierDirectory/SupplierForm"),
);
const UserView = lazy(
    () => import("./pages/SystemConfigurations/Users/UserView"),
);
const UserForm = lazy(
    () => import("./pages/SystemConfigurations/Users/UserForm"),
);
const PlanningForm = lazy(
    () => import("./pages/SystemConfigurations/Planning/PlanningForm"),
);
const ContactForm = lazy(() => import("./pages/ContactDirectory/ContactForm"));

const ContactView = lazy(() => import("./pages/ContactDirectory/ContactView"));
const DMView = lazy(() => import("./pages/DocumentManagement/DMView"));
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
                        {/* Protected App Layout */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route index path="/" element={<Home />} />

                                {/* Contact Directory Page */}
                                <Route
                                    index
                                    path="/contact-directory"
                                    element={<ContactView />}
                                />
                                <Route
                                    path="/contact-directory/:method/:id?"
                                    element={<ContactForm />}
                                />

                                {/* Contact Directory Page */}
                                <Route
                                    index
                                    path="/supplier-directory"
                                    element={<SupplierView />}
                                />
                                <Route
                                    path="/supplier-directory/:method/:id?"
                                    element={<SupplierForm />}
                                />

                                {/* Configurations */}
                                {/* IPC Page */}
                                <Route
                                    index
                                    path="/invoice-payment-clerk"
                                    element={<IPCView />}
                                />
                                <Route
                                    path="/invoice-payment-clerk/:method/:id?"
                                    element={<IPCForm />}
                                />

                                {/* Supplier Page */}
                                {/* <Route
                                    path="/suppliers"
                                    element={<SupplierView />}
                                />
                                <Route
                                    path="/suppliers/:method/:id?"
                                    element={<SupplierForm />}
                                /> */}

                                {/* User Page */}
                                <Route path="/users" element={<UserView />} />
                                <Route
                                    path="/users/:method/:id?"
                                    element={<UserForm />}
                                />

                                {/* Planning Page */}
                                <Route
                                    path="/planning"
                                    element={<PlanningForm />}
                                />
                                <Route
                                    path="/planning/:id?"
                                    element={<PlanningForm />}
                                />

                                {/* Others Page */}
                                <Route
                                    path="/document-management"
                                    element={<DMView />}
                                />
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
                            </Route>
                        </Route>

                        {/* Auth */}
                        <Route path="/signin" element={<SignIn />} />

                        {/* Fallback Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Router>
        </>
    );
}
