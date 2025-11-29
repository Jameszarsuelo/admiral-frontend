export default function BordereauSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`p-6 border rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center ${className}`}>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="space-y-2">
                    <div className="w-56 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="w-40 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="w-64 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-2" />
                </div>
            </div>
        </div>
    );
}
