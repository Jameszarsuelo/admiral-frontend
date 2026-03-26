import { useCallback, type ReactNode } from "react";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { Link, useNavigate } from "react-router-dom";

export type DashboardMetricCardProps = {
    label?: string;
    value?: string;
    children?: ReactNode;
    to?: string;
    /**
     * Tailwind classes controlling the grid column span.
     * Defaults to a 4-up layout on xl screens, 2-up on small screens.
     */
    colSpanClassName?: string;
};

export default function DashboardMetricCard({
    label,
    value,
    children,
    to,
    colSpanClassName = "col-span-12 sm:col-span-6 xl:col-span-3",
}: DashboardMetricCardProps) {
    const content = children ?? <EcommerceMetrics label={label} value={value} />;
    const navigate = useNavigate();

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (!to) {
                return;
            }

            event.preventDefault();
            navigate(to);
        },
        [navigate, to],
    );

    return (
        <div className={colSpanClassName}>
            {to ? (
                <Link
                    to={to}
                    onClick={handleClick}
                    className="group block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    aria-label={label ? `Open ${label}` : undefined}
                >
                    <div className="w-full [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu group-hover:[&>div]:shadow-theme-md group-hover:[&>div]:-translate-y-0.5 group-hover:[&>div]:scale-[1.02]">
                        {content}
                    </div>
                </Link>
            ) : (
                <div className="w-full [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02]">
                    {content}
                </div>
            )}
        </div>
    );
}
