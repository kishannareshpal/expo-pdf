import * as React from 'react';
import { requireNativeView } from 'expo';

import { StyleProp, ViewStyle } from 'react-native';

type BaseProps = {
  style?: StyleProp<ViewStyle>;
  uri: string;
}

type NativePdfViewProps = BaseProps & {};

const NativePdfView: React.ComponentType<NativePdfViewProps> = requireNativeView('KJExpoPdf', 'PdfView');

// -----------

export type PdfViewProps = BaseProps;

export const PdfView = ({ style, uri }: PdfViewProps) => {
  return (
    <NativePdfView
      style={style}
      uri={uri}
    />
  )
}
