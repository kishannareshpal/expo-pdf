import { requireNativeView } from 'expo';
import * as React from 'react';

import {
  ContentPadding,
  FitMode,
  OnErrorEventPayload,
  OnLoadCompleteEventPayload,
  OnPageChangedEventPayload,
} from './types';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { forwardNativeEventTo } from './utils';

type BaseProps = ViewProps & {
  /**
   * The file URI.
   *
   * Accepts either:
   * - a remote resource (e.g., https://…)
   * - a local file path (e.g., file:///…)
   */
  uri: string;

  /**
   * Password used to open password-protected or encrypted PDFs.
   * If not provided, locked documents will fail to load.
   */
  password?: string;

  /**
   * Enables page-by-page snapping instead of free scrolling.
   *
   * Defaults to vertical paging. If `horizontal` is true,
   * paging occurs horizontally instead.
   */
  pagingEnabled?: boolean;

  /**
   * Enables zoom in/out via double-tap gestures on the document.
   */
  doubleTapToZoom?: boolean;

  /**
   * Renders and scrolls pages horizontally instead of vertically.
   *
   * If `pagingEnabled` is true, page snapping will follow the same direction.
   */
  horizontal?: boolean;

  /**
   * Space between adjacent pages, expressed in layout units (dp/px depending on platform).
   */
  pageGap?: number;

  /**
   * Padding applied around the document inside the viewer container.
   *
   * In paging mode, this affects the default fitted page placement. Zoomed pages
   * can render across the padded area while pan limits preserve the padding at
   * the page edges.
   *
   * In continuous mode, this is scrollable padding around the document flow.
   */
  contentPadding?: ContentPadding;

  /**
   * Minimum zoom scale allowed by the viewer.
   *
   * Currently supported on iOS only. Android support is planned.
   */
  minScaleFactor?: number;

  /**
   * Determines how the document is scaled to fit within the viewer
   * (e.g., fit to width, height, or entire page depending on enum value).
   */
  fitMode?: FitMode;

  /**
   * Automatically rescales the document when its own layout
   * or its parent view’s layout changes after initial render.
   *
   * Note: initial render always auto-scales according to `fitMode`.
   */
  autoScale?: boolean;

  /**
   * Inverts the color of the pages to make them dark.
   * - This is useful for documents that have white pages so this can be used to make it dark, however the image colors in the document are also inverted.
   *
   * Defaults to false.
   */
  pageColorInverted?: boolean;
};

type NativePdfViewProps = BaseProps & {
  /**
   * Fired after the PDF document has been fully loaded
   * and its metadata (such as page count) is available.
   */
  onLoadComplete?: (
    event: NativeSyntheticEvent<OnLoadCompleteEventPayload>
  ) => void;

  /**
   * Fired when the currently visible page changes due to user interaction
   * or programmatic scroll/paging.
   */
  onPageChanged?: (
    event: NativeSyntheticEvent<OnPageChangedEventPayload>
  ) => void;

  /**
   * Fired when the PDF fails to load, decrypt, or render.
   * The payload contains error information.
   */
  onError?: (event: NativeSyntheticEvent<OnErrorEventPayload>) => void;
};

const NativePdfView: React.ComponentType<NativePdfViewProps> =
  requireNativeView('KJExpoPdf');

// -----------

export type PdfViewProps = BaseProps & {
  onLoadComplete?: (params: OnLoadCompleteEventPayload) => void;
  onPageChanged?: (params: OnPageChangedEventPayload) => void;
  onError?: (params: OnErrorEventPayload) => void;
};

export const PdfView = ({
  style,
  onLoadComplete,
  onError,
  onPageChanged,
  ...props
}: PdfViewProps) => {
  const iosOnlyProps =
    Platform.OS === 'ios' ? { minScaleFactor: props.minScaleFactor } : {};

  return (
    <NativePdfView
      style={[styles.container, style]}
      uri={props.uri}
      doubleTapToZoom={props.doubleTapToZoom}
      horizontal={props.horizontal}
      pageGap={props.pageGap}
      pagingEnabled={props.pagingEnabled}
      password={props.password}
      contentPadding={props.contentPadding}
      {...iosOnlyProps}
      fitMode={props.fitMode}
      autoScale={props.autoScale}
      pageColorInverted={props.pageColorInverted}
      onLoadComplete={forwardNativeEventTo(onLoadComplete)}
      onPageChanged={forwardNativeEventTo(onPageChanged)}
      onError={forwardNativeEventTo(onError)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eeeeee',
  },
});
