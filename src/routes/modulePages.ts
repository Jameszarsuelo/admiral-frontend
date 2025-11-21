import { lazy } from "react";

const Home = lazy(() => import("../pages-backup/Dashboard/Home"));
const BPCIndex = lazy(() => import("../pages/SystemConfigurations/BordereauPaymentClerks/BPCIndex"));
const BPCForm = lazy(
    () => import("../pages/SystemConfigurations/BordereauPaymentClerks/BPCForm"),
);
const SupplierIndex = lazy(() => import("../pages/SupplierDirectory/SupplierIndex"));
const SupplierForm = lazy(
    () => import("../pages/SupplierDirectory/SupplierForm"),
);

const BordereauIndex = lazy(() => import("../pages/BordereauDetail/BordereauIndex"));
const BordereauForm = lazy(() => import("../pages/BordereauDetail/BordereauForm"));

const UserIndex = lazy(() => import("../pages/SystemConfigurations/Users/UserIndex"));
const UserForm = lazy(
    () => import("../pages/SystemConfigurations/Users/UserForm"),
);

const PlanningIndex = lazy(() => import("../pages/SystemConfigurations/Planning/PlanningIndex"));
const PlanningForm = lazy(() => import("../pages/SystemConfigurations/Planning/PlanningForm"));
const OutcomeIndex = lazy(() => import("../pages/SystemConfigurations/Outcomes/OutcomeIndex"));
const OutcomeForm = lazy(() => import("../pages/SystemConfigurations/Outcomes/OutcomeForm"));
const ContactIndex = lazy(() => import("../pages/ContactDirectory/ContactIndex"));
const ContactForm = lazy(() => import("../pages/ContactDirectory/ContactForm"));
const ContactView = lazy(() => import("../pages/ContactDirectory/ContactView"));

const DMView = lazy(() => import("../pages/DocumentManagement/DMView"));
<<<<<<< Updated upstream
=======
const DMForm = lazy(() => import("../pages/DocumentManagement/DMForm"));

const BQMView = lazy(() => import("../pages/BordereauQueryManagement/BQMView"));
// const DMForm = lazy(() => import("../pages/DocumentManagement/DMForm"));
>>>>>>> Stashed changes

// System Configurations - new pages
const ProfileView = lazy(() => import("../pages/SystemConfigurations/Profiles/ProfileView"));
const ProfileIndex = lazy(() => import("../pages/SystemConfigurations/Profiles/ProfileIndex"));
const ProfileForm = lazy(() => import("../pages/SystemConfigurations/Profiles/ProfileForm"));

const RoleView = lazy(() => import("../pages/SystemConfigurations/Roles/RoleView"));
const RoleForm = lazy(() => import("../pages/SystemConfigurations/Roles/RoleForm"));

const ModuleView = lazy(() => import("../pages/SystemConfigurations/Modules/ModuleView"));
const ModuleForm = lazy(() => import("../pages/SystemConfigurations/Modules/ModuleForm"));

const ModuleActionView = lazy(() => import("../pages/SystemConfigurations/ModuleActions/ModuleActionIndex"));
const ModuleActionForm = lazy(() => import("../pages/SystemConfigurations/ModuleActions/ModuleActionForm"));

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
        main: UserIndex,
        create: UserForm,
        edit: UserForm,
        view: UserIndex,
    },
    contact_directory: {
        main: ContactIndex,
        create: ContactForm,
        edit: ContactForm,
        view: ContactView,
    },
   bordereau_detail: {
        main: BordereauIndex,
        create: BordereauForm,
        edit: BordereauForm,
        view: BordereauIndex,
    },
    supplier_directory: {
        main: SupplierIndex,
        create: SupplierForm,
        edit: SupplierForm,
        // supplierDetails: SupplierView,
    },
    bpc: {
        main: BPCIndex,
        create: BPCForm,
        edit: BPCForm,
        view: BPCIndex,
    },
    profiles: {
        main: ProfileIndex,
        create: ProfileForm,
        edit: ProfileForm,
        view: ProfileView,
    },
    roles: {
        main: RoleView,
        create: RoleForm,
        edit: RoleForm,
        view: RoleView,
    },
    modules: {
        main: ModuleView,
        create: ModuleForm,
        edit: ModuleForm,
        view: ModuleView,
    },
    module_actions: {
        main: ModuleActionView,
        create: ModuleActionForm,
        edit: ModuleActionForm,
        view: ModuleActionView,
    },
    planning: {
        main: PlanningIndex,
        create: PlanningForm,
        edit: PlanningForm,
        view: PlanningIndex,
    },
    outcomes: {
        main: OutcomeIndex,
        create: OutcomeForm,
        edit: OutcomeForm,
        view: OutcomeIndex,
    },
    document_management: {
        main: DMView,
<<<<<<< Updated upstream
=======
        create: DMForm,
        edit: DMForm,
    },
    bordereau_query_management: {
        main: BQMView,
        create: DMForm,
        edit: DMForm,
>>>>>>> Stashed changes
    },
    dashboard: {
        main: Home,
    },
    not_found: {
        main: NotFound,
    },
};
