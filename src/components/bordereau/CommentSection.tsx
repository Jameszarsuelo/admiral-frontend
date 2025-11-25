import { dateFormat } from "@/helper/dateFormat";
import { IBordereauComment } from "@/types/BordereauSchema";

interface Props {
    comments?: IBordereauComment[];
}

export default function CommentSection({ comments = [] }: Props) {
    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {comments.map((c) => (
                <div key={c.id} className="py-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex-col items-center gap-2">
                                <button className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 hover:underline leading-none">
                                    {c.created_by}
                                </button>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {c.created_at ? dateFormat(c.created_at) : "-"}
                                </div>
                            </div>

                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                                {c.comment}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
