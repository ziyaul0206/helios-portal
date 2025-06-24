import { useRef, useCallback } from 'react'

type CacheKey = string
type RequestFunction<T> = () => Promise<T>

export const useRequestCache = <T>() => {
  const inFlightRequests = useRef<Map<CacheKey, Promise<T>>>(new Map())
  const cache = useRef<Map<CacheKey, { data: T; timestamp: number }>>(new Map())
  
  const executeRequest = useCallback(
    async (
      key: CacheKey,
      requestFn: RequestFunction<T>,
      options?: {
        cacheDuration?: number // in milliseconds
        forceRefresh?: boolean
      }
    ): Promise<T> => {
      const { cacheDuration = 5 * 60 * 1000, forceRefresh = false } = options || {}
      
      // Check cache if no forceRefresh
      if (!forceRefresh && cache.current.has(key)) {
        const cached = cache.current.get(key)!
        const isExpired = Date.now() - cached.timestamp > cacheDuration
        
        if (!isExpired) {
          return cached.data
        }
      }
      
      // Check if a request is already in progress
      if (inFlightRequests.current.has(key)) {
        return inFlightRequests.current.get(key)!
      }
      
      // Create and cache the new request
      const promise = requestFn()
        .then((data) => {
          // Cache the result
          cache.current.set(key, {
            data,
            timestamp: Date.now()
          })
          return data
        })
        .finally(() => {
          // Clean up the in-flight request
          inFlightRequests.current.delete(key)
        })
      
      inFlightRequests.current.set(key, promise)
      return promise
    },
    []
  )
  
  const clearCache = useCallback((key?: CacheKey) => {
    if (key) {
      cache.current.delete(key)
      inFlightRequests.current.delete(key)
    } else {
      cache.current.clear()
      inFlightRequests.current.clear()
    }
  }, [])
  
  const getCachedData = useCallback((key: CacheKey) => {
    return cache.current.get(key)?.data
  }, [])
  
  return {
    executeRequest,
    clearCache,
    getCachedData
  }
}