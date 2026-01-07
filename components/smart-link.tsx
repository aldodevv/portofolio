'use client'

import Link, { LinkProps } from 'next/link'
import { useState } from 'react'

interface SmartLinkProps extends LinkProps {
    children: React.ReactNode
    className?: string
    prefetchOnHover?: boolean
}

/**
 * SmartLink component wrapper around Next.js Link.
 * Offers 'prefetchOnHover' capability to optimize resource usage.
 * Defaults to standard Next.js behavior if prefetchOnHover is not explicitly set to true.
 * However, per user request for optimization, we default generic 'prefetch' prop to false 
 * when 'prefetchOnHover' is potentially active, managed by internal state.
 */
export default function SmartLink({
    children,
    prefetchOnHover = true,
    ...props
}: SmartLinkProps) {
    const [shouldPrefetch, setShouldPrefetch] = useState(false)

    // If we want hover-only prefetching:
    // We set the Next.js `prefetch` prop to our internal `shouldPrefetch` state (or null/false based on logic).
    // The documentation example suggests: prefetch={active ? null : false}
    // where null means "default behavior" (prefetch triggered) and false means disabled.

    const prefetchProp = prefetchOnHover
        ? (shouldPrefetch ? undefined : false)
        : props.prefetch

    return (
        <Link
            {...props}
            prefetch={prefetchProp}
            onMouseEnter={(e) => {
                if (prefetchOnHover) setShouldPrefetch(true)
                props.onMouseEnter?.(e)
            }}
        >
            {children}
        </Link>
    )
}
