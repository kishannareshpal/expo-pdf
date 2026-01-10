import * as React from 'react';
import { requireNativeView } from 'expo';

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

type BaseProps = {
  style?: StyleProp<ViewStyle>;
  uri: string;
}

type NativeSpecViewProps = BaseProps & {};

const NativeSpecView: React.ComponentType<NativeSpecViewProps> = requireNativeView('KJExpoPdf', 'KJSpecView');

// -----------

export type SpecViewProps = BaseProps;

export const SpecView = ({ style, uri }: SpecViewProps) => {
  return (
    <NativeSpecView
      style={style}
      uri={uri}
    />
  )
}
