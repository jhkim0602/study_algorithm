import { useCallback, useEffect, useState } from 'react'

// localStorage에 JSON 값을 영속화하는 범용 훅. (DB 없이 상태 저장)
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* 저장 실패는 무시 (학습용 정적 사이트) */
    }
  }, [key, value])

  return [value, setValue]
}

// 해시 기반 라우팅 ('#/slug' → 'slug'). 정적 호스팅·file:// 호환.
export function useHashRoute() {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to) => {
    window.location.hash = '#/' + to
  }, [])

  return [route, navigate]
}
