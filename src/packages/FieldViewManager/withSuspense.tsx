import React from 'react'
import { Skeleton } from 'antd'

import type { FieldViewImplement } from '@packages/miscellaneous/FieldViewManager/types'

export const withSuspense = (WrappedComponent: FieldViewImplement<any>) => {
  return function WithSuspenseHOC(props: any) {
    return (
      <React.Suspense fallback={<Skeleton active paragraph={{ rows: 2 }} />}>
        <WrappedComponent {...props} />
      </React.Suspense>
    )
  }
}
