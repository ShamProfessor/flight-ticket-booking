import React from 'react'

export const MissingView =
  process.env.NODE_ENV === 'production'
    ? () => null
    : () => React.createElement(React.Fragment, null, `Can not found field view!`)
