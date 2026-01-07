'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Custom hook for advanced navigation handling using Next.js router and History API.
 */
export function useAppNavigation() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    /**
     * Updates the URL search parameters without reloading the page.
     * Uses window.history.pushState to add a new entry to the history stack.
     * @param params - Object containing key-value pairs to update or add.
     */
    const updateSearchParams = useCallback((params: Record<string, string | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value === null) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, value)
            }
        })

        const newPath = `?${newSearchParams.toString()}`
        window.history.pushState(null, '', newPath)
    }, [searchParams])

    /**
     * Replaces the current URL search parameters without reloading the page.
     * Uses window.history.replaceState to replace the current entry in the history stack.
     * @param params - Object containing key-value pairs to set.
     */
    const replaceSearchParams = useCallback((params: Record<string, string | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value === null) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, value)
            }
        })

        const newPath = `?${newSearchParams.toString()}`
        window.history.replaceState(null, '', newPath)
    }, [searchParams])

    /**
     * Navigate to a new route.
     * Wrapper around router.push.
     */
    const navigateTo = useCallback((href: string) => {
        router.push(href)
    }, [router])

    /**
   * Prefetch a route.
   * Wrapper around router.prefetch.
   */
    const prefetchRoute = useCallback((href: string) => {
        router.prefetch(href)
    }, [router])


    return {
        router,
        pathname,
        searchParams,
        updateSearchParams,
        replaceSearchParams,
        navigateTo,
        prefetchRoute
    }
}
