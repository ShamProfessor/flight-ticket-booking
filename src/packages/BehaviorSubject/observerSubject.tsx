import { forwardRef, memo } from 'react'

import useObserverSubject from '@packages/miscellaneous/BehaviorSubject/useObserverSubject'

import type { ForwardRefRenderFunction, FunctionComponent } from 'react'
import type BehaviorSubject from '@packages/miscellaneous/BehaviorSubject/index'

function observerSubject<P extends Record<string, any> & { observer: BehaviorSubject }, TRef = {}>(
  baseComponent: ForwardRefRenderFunction<TRef, P> | FunctionComponent<P>,
  options?: {
    forwardRef: false
  }
) {
  const baseComponentName = baseComponent.displayName || baseComponent.name

  const wrappedComponent = (props: P, ref: React.Ref<TRef>) => {
    const observerValue = useObserverSubject({ observer: props.observer })
    return baseComponent({ ...props, observerValue }, ref)
  }
  wrappedComponent.displayName = baseComponentName

  if (options?.forwardRef) {
    return memo(forwardRef(wrappedComponent))
  }
  return memo(wrappedComponent)
}

export default observerSubject
