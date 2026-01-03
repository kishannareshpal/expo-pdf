import { requireNativeView } from 'expo';
import * as React from 'react';

import { KishanExpoPdfViewProps } from './KishanExpoPdf.types';

const NativeView: React.ComponentType<KishanExpoPdfViewProps> =
  requireNativeView('KishanExpoPdf');

export default function KishanExpoPdfView(props: KishanExpoPdfViewProps) {
  return <NativeView {...props} />;
}
