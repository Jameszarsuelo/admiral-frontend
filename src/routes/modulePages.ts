import { lazy } from "react";

const Home = lazy(() => import("../pages-backup/Dashboard/Home"));
const BPCIndex = lazy(
    () =>
        import("../pages/SystemConfigurations/BordereauPaymentClerks/BPCIndex"),
);
const BPCForm = lazy(
    () =>
        import("../pages/SystemConfigurations/BordereauPaymentClerks/BPCForm"),
);
const SupplierIndex = lazy(
    () => import("../pages/SupplierDirectory/SupplierIndex"),
);
const SupplierForm = lazy(
    () => import("../pages/SupplierDirectory/SupplierForm"),
);
const SupplierView = lazy(
    () => import("../pages/SupplierDirectory/SupplierView"),
);

const BordereauProcessQueueView = lazy(
    () => import("../pages/SystemConfigurations/BordereauProcessingQueue/BordereauProcessingQueueView"),
);

const BordereauProcessQueueForm = lazy(
    () => import("../pages/SystemConfigurations/BordereauProcessingQueue/BordereauProcessingQueueForm"),
);

const BordereauIndex = lazy(
    () => import("../pages/BordereauDetail/BordereauIndex"),
);
const BordereauView = lazy(
    () => import("../pages/BordereauDetail/BordereauView"),
);
const BordereauForm = lazy(
    () => import("../pages/BordereauDetail/BordereauForm"),
);

const UserIndex = lazy(
    () => import("../pages/SystemConfigurations/Users/UserIndex"),
);
const UserForm = lazy(
    () => import("../pages/SystemConfigurations/Users/UserForm"),
);

const SupplierUserIndex = lazy(
    () =>
        import("../pages/SystemConfigurations/SupplierUsers/SupplierUserIndex"),
);
const SupplierUserForm = lazy(
    () =>
        import("../pages/SystemConfigurations/SupplierUsers/SupplierUserForm"),
);

const PlanningIndex = lazy(
    () => import("../pages/SystemConfigurations/Planning/PlanningIndex"),
);
const PlanningForm = lazy(
    () => import("../pages/SystemConfigurations/Planning/PlanningForm"),
);
const ReasonIndex = lazy(
    () => import("../pages/SystemConfigurations/Reason/ReasonIndex"),
);
const ReasonForm = lazy(
    () => import("../pages/SystemConfigurations/Reason/ReasonForm"),
);
const DepartmentIndex = lazy(
    () => import("../pages/SystemConfigurations/Departments/DepartmentIndex"),
);
const DepartmentForm = lazy(
    () => import("../pages/SystemConfigurations/Departments/DepartmentForm"),
);
const BordereauTypeIndex = lazy(
    () => import("../pages/SystemConfigurations/BordereauTypes/BordereauTypeIndex"),
);
const BordereauTypeForm = lazy(
    () => import("../pages/SystemConfigurations/BordereauTypes/BordereauTypeForm"),
);
const WorkTypeIndex = lazy(
    () => import("../pages/SystemConfigurations/WorkTypes/WorkTypeIndex"),
);
const WorkTypeForm = lazy(
    () => import("../pages/SystemConfigurations/WorkTypes/WorkTypeForm"),
);
const OutcomeIndex = lazy(
    () => import("../pages/SystemConfigurations/Outcomes/OutcomeIndex"),
);
const OutcomeForm = lazy(
    () => import("../pages/SystemConfigurations/Outcomes/OutcomeForm"),
);
const OutcomeView = lazy(
    () => import("../pages/SystemConfigurations/Outcomes/OutcomeView"),
);
const ContactIndex = lazy(
    () => import("../pages/ContactDirectory/ContactIndex"),
);
const ContactForm = lazy(() => import("../pages/ContactDirectory/ContactForm"));
const ContactView = lazy(() => import("../pages/ContactDirectory/ContactView"));

const DMView = lazy(() => import("../pages/DocumentManagement/DMView"));
const DMForm = lazy(() => import("../pages/DocumentManagement/DMForm"));

const BQMView = lazy(() => import("../pages/BordereauQueryManagement/BQMView"));
// const DMForm = lazy(() => import("../pages/DocumentManagement/DMForm"));

// System Configurations - new pages
const ProfileView = lazy(
    () => import("../pages/SystemConfigurations/Profiles/ProfileView"),
);
const ProfileIndex = lazy(
    () => import("../pages/SystemConfigurations/Profiles/ProfileIndex"),
);
const ProfileForm = lazy(
    () => import("../pages/SystemConfigurations/Profiles/ProfileForm"),
);

const RoleView = lazy(
    () => import("../pages/SystemConfigurations/Roles/RoleView"),
);
const RoleForm = lazy(
    () => import("../pages/SystemConfigurations/Roles/RoleForm"),
);

const ModuleView = lazy(
    () => import("../pages/SystemConfigurations/Modules/ModuleView"),
);
const ModuleForm = lazy(
    () => import("../pages/SystemConfigurations/Modules/ModuleForm"),
);

const ModuleActionView = lazy(
    () =>
        import("../pages/SystemConfigurations/ModuleActions/ModuleActionIndex"),
);
const ModuleActionForm = lazy(
    () =>
        import("../pages/SystemConfigurations/ModuleActions/ModuleActionForm"),
);

const TaskDetailView = lazy(() => import("@/pages/TaskDetail/TaskDetailView"));

const Workplace = lazy(() => import("../pages/BPC/Workplace"));

const BpcSupplierSkillsIndex = lazy(
    () => import("../pages/SystemConfigurations/BpcSupplierSkills/BpcSupplierSkillsIndex"),
);

const BpcSupplierSkillsView = lazy(
    () => import("../pages/SystemConfigurations/BpcSupplierSkills/BpcSupplierSkillsView"),
);

const TaskQueuesView = lazy(
    () => import("@/pages/SystemConfigurations/TaskQueues/TaskQueuesView"),
);

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
        view: BordereauView,
    },
    supplier_directory: {
        main: SupplierIndex,
        create: SupplierForm,
        edit: SupplierForm,
        view: SupplierView,
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
        view: OutcomeView,
    },
    reason: {
        main: ReasonIndex,
        create: ReasonForm,
        edit: ReasonForm,
        view: ReasonIndex,
    },
    departments: {
        main: DepartmentIndex,
        create: DepartmentForm,
        edit: DepartmentForm,
        view: DepartmentIndex,
    },
    bordereau_types: {
        main: BordereauTypeIndex,
        create: BordereauTypeForm,
        edit: BordereauTypeForm,
        view: BordereauTypeIndex,
    },
    work_types: {
        main: WorkTypeIndex,
        create: WorkTypeForm,
        edit: WorkTypeForm,
        view: WorkTypeIndex,
    },
    document_management: {
        main: DMView,
        create: DMForm,
        edit: DMForm,
    },
    bordereau_query_management: {
        main: BQMView,
        create: DMForm,
        edit: DMForm,
    },
    task_detail: {
        main: TaskDetailView,
        create: DMForm,
        edit: DMForm,
    },
    task_queues: {
        main: TaskQueuesView,
        create: DMForm,
        edit: DMForm,
    },
    workplace: {
        main: Workplace,
    },
    bpc_supplier_skills: {
        main: BpcSupplierSkillsIndex,
        view: BpcSupplierSkillsView,
    },
    dashboard: {
        main: Home,
    },
    not_found: {
        main: NotFound,
    },
    supplier_users: {
        main: SupplierUserIndex,
        create: SupplierUserForm,
        edit: SupplierUserForm,
        view: SupplierUserIndex,
    },
    bordereau_processing_queue: {
        main: BordereauProcessQueueView,
        create: BordereauProcessQueueForm,
        edit: BordereauProcessQueueForm,
        view: BordereauProcessQueueView,
    },
};
