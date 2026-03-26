export type CsvFormValues = {
    document?: File | null;
    admiral_invoice_type?: string;
    bordereau_type_id?: string;
    supplier_id?: string;
    bordereau_department_id?: string;
    bordereau?: string;
    override_import_date?: string;
};

export type StatusItem = {
    id?: number | string;
    value?: number | string;
    key?: number | string;
    slug?: number | string;
    label?: string;
    name?: string;
    title?: string;
};

export type SimpleOptionItem = {
    id?: number | string;
    value?: number | string;
    label?: string;
    name?: string;
    department?: string;
    bordereau_type?: string;
    outcome_code?: string;
    description?: string;
};

export type TFilterFormState = {
    invoice_status: string;
    supplier_id: string;
    bpc_id: string;
    date_from: string;
    date_to: string;
    search: string;
};

export type TAppliedFilters = TFilterFormState & {
    page: number;
    per_page: number;
    include_comments: boolean;
    date_type?: string;
    bordereau_status?: string;
};
