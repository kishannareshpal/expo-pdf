'use dom'

import { DOMProps } from 'expo/dom'

export type HeadingProps = {
  name: string,
  dom?: DOMProps
}

export default ({ name }: HeadingProps) => {
  return (
    <div style={{ width: 500, height: 500, padding: 12 }}>
      <h1>Hello, {name}</h1>
    </div>
  );
}
