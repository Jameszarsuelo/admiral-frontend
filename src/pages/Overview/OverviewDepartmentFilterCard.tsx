import Select from "@/components/form/Select";

type OverviewDepartmentFilterCardProps = {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
};

export default function OverviewDepartmentFilterCard({
    value,
    options,
    onChange,
}: OverviewDepartmentFilterCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Department
                </h4>
                <div className="mt-3">
                    <Select value={value} onChange={onChange} options={options} />
                </div>
            </div>
        </div>
    );
}
