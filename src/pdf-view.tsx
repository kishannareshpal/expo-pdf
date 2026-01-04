import { requireNativeView } from 'expo';
import * as React from 'react';

import { OnErrorEventPayload, OnLoadCompleteEventPayload, OnPageChangedEventPayload } from './types';
import { NativeSyntheticEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { forwardNativeEventTo } from './utils';

type BaseProps = {
  /**
   * The file URI. Accepts a remote resource (e.g. via HTTPs) or a local file path (e.g. file:///)
   */
  uri: string;
  style?: StyleProp<ViewStyle>;
}

type NativePdfViewProps = BaseProps & {
  onLoadComplete?: (event: NativeSyntheticEvent<OnLoadCompleteEventPayload>) => void;
  onPageChanged?: (event: NativeSyntheticEvent<OnPageChangedEventPayload>) => void;
  onError?: (event: NativeSyntheticEvent<OnErrorEventPayload>) => void;
};

const NativePdfView: React.ComponentType<NativePdfViewProps> = requireNativeView('ExpoPdf');

// -----------

export type PdfViewProps = BaseProps & {
  onLoadComplete?: (params: OnLoadCompleteEventPayload) => void,
  onPageChanged?: (params: OnPageChangedEventPayload) => void,
  onError?: (params: OnErrorEventPayload) => void
};

export const PdfView = ({
  style,
  onLoadComplete,
  onError,
  onPageChanged,
  ...props
}: PdfViewProps) => {
  return (
    <NativePdfView
      style={[styles.container, style]}
      onLoadComplete={forwardNativeEventTo(onLoadComplete)}
      onPageChanged={forwardNativeEventTo(onPageChanged)}
      onError={forwardNativeEventTo(onError)}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eeeeee'
  }
})