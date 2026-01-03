import * as React from 'react';

import { KishanExpoPdfViewProps } from './KishanExpoPdf.types';

export default function KishanExpoPdfView(props: KishanExpoPdfViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
