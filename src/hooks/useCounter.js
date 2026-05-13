import { useState, useEffect, useRef } from 'react'

export function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const [isActive, setIsActive] = useState(false)
  const countRef = useRef(null)

  const startCounting = () => setIsActive(true)

  useEffect(() => {
    if (!isActive) return

    const startTime = performance.now()
    const range = end - start

    const step = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + range * eased)

      setCount(current)

      if (progress < 1) {
        countRef.current = requestAnimationFrame(step)
      }
    }

    countRef.current = requestAnimationFrame(step)

    return () => {
      if (countRef.current) cancelAnimationFrame(countRef.current)
    }
  }, [isActive, end, start, duration])

  return { count, startCounting }
}
