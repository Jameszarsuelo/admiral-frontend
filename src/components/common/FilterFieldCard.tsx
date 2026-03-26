import type { ReactNode } from "react";

type FilterFieldCardProps = {
    label: string;
    description?: string;
    children: ReactNode;
    className?: string;
};

export default function FilterFieldCard({
    label,
    description,
    children,
    className = "",
}: FilterFieldCardProps) {
    return (
        <div
            className={`rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-white/5 ${className}`}
        >
            <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </h4>
                {description ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                ) : null}
            </div>
            {children}
        </div>
    );
}