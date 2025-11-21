export default function SidebarSkeleton() {
    // 6 skeleton rows (you can adjust)
    const rows = Array.from({ length: 6 });

    return (
        <aside
            className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 
                h-screen w-[290px] border-r border-gray-200 dark:border-gray-800 animate-pulse"
        >
            <div className="py-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div>
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">
                {rows.map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>
        </aside>
    );
}
