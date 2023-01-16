import { useCallback, useEffect, useRef, useState } from 'react'

import { isEqual, isNull } from 'lodash-es'

import type BehaviorSubject from '@packages/miscellaneous/BehaviorSubject/index'

function useObserverSubject<T>(
  { observer, initialvalue }: { observer: BehaviorSubject; initialvalue?: T },
  force = false
) {
  const [, setState] = useState()
  const forceUpdate = () => setState([] as any)
  const observerValue = useRef<T | null>(initialvalue ?? null)

  const update = useCallback((data: T) => {
    observerValue.current = data
    forceUpdate()
  }, [])

  useEffect(() => {
    let isMounted = true
    const handleSubject = (data: T) => {
      if (force || isNull(observerValue.current)) {
        isMounted && update(data)
        return
      }
      if (!isEqual(observerValue.current, data)) {
        isMounted && update(data)
        return
      }
    }

    observer.subscribe(handleSubject)

    return () => {
      observer.unsubscribe(handleSubject)
      isMounted = false
    }
  }, [force, observer, update])

  return observerValue.current
}

export default useObserverSubject
