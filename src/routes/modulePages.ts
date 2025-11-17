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

const BordereauView = lazy(() => import("../pages/BordereauDetail/BordereauView"));
const BordereauForm = lazy(() => import("../pages/BordereauDetail/BordereauForm"));

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
   bordereau_detail: {
        main: BordereauView,
        create: BordereauForm,
        edit: BordereauForm,
        view: BordereauView,
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
