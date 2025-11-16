import { lazy } from "react";

const Home = lazy(() => import("../pages-backup/Dashboard/Home"));
const IPCView = lazy(() => import("../pages/SystemConfigurations/InvoicePaymentClerks/IPCView"));
const IPCForm = lazy(
    () => import("../pages/SystemConfigurations/InvoicePaymentClerks/IPCForm"),
);
const SupplierView = lazy(() => import("../pages/SupplierDirectory/SupplierView"));
const SupplierForm = lazy(
    () => import("../pages/SupplierDirectory/SupplierForm"),
);

const InvoiceView = lazy(() => import("../pages/InvoiceDetail/InvoiceView"));
const InvoiceForm = lazy(() => import("../pages/InvoiceDetail/InvoiceForm"));

const UserView = lazy(() => import("../pages/SystemConfigurations/Users/UserView"));
const UserForm = lazy(
    () => import("../pages/SystemConfigurations/Users/UserForm"),
);

const PlanningForm = lazy(() => import("../pages/SystemConfigurations/Planning/PlanningForm"));
const ContactView = lazy(() => import("../pages/ContactDirectory/ContactView"));
const ContactForm = lazy(() => import("../pages/ContactDirectory/ContactForm"));

const DMView = lazy(() => import("../pages/DocumentManagement/DMView"));

const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));

export interface ModuleComponents {
    main: React.FC;
    create?: React.FC;
    edit?: React.FC;
    view?: React.FC;
    supplierDetails?: React.FC;
    viewStaff?: React.FC;
    viewDocuments?: React.FC;
}

// Correct TypeScript typing
export const modulePageMap: Record<string, ModuleComponents> = {
    // dashboard: Home,
    // contact_directory: ContactView,
    // invoice_detail: InvoiceView,
    // supplier_directory: SupplierView,
    // invoice_payment_clerk: IPCView,
    // users: UserView,
    // planning: PlanningForm,
    // document_management: DMView,
    // form_elements: FormElements,
    // not_found: NotFound,
    users: {
        main: UserView,
        create: UserForm,
        edit: UserForm,
        view: UserView,
    },
    contact_directory: {
        main: ContactView,
        create: ContactForm,
        edit: ContactForm,
        view: ContactView,
    },
    invoice_detail: {
        main: InvoiceView,
        create: InvoiceForm,
        edit: InvoiceForm,
        view: InvoiceView,
    },
    supplier_directory: {
        main: SupplierView,
        create: SupplierForm,
        edit: SupplierForm,
        // supplierDetails: SupplierView,
    },
    ipc: {
        main: IPCView,
        create: IPCForm,
        edit: IPCForm,
        view: IPCView,
    },
    planning: {
        main: PlanningForm,
        edit: PlanningForm,
        view: PlanningForm,
    },
    document_management: {
        main: DMView,
    },
    dashboard: {
        main: Home,
    },
    not_found: {
        main: NotFound,
    },
};
