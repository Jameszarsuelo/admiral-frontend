import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

interface BadgeProps {
    children: ReactNode;
    className?: string;
}


const Badge: FC<BadgeProps> = ({ className, children }) => {
    return (
        <>
            <span className={clsx(twMerge("inline-flex items-center justify-center gap-1 rounded-full py-0.5 pl-2.5 pr-2 text-sm font-medium text-white", className))}
        >
            {children}
        </span >
    </>
  )
}

export default Badge
