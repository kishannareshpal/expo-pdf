import {
  Host,
  ModalBottomSheet,
  RNHostView,
  type ModalBottomSheetRef,
} from '@expo/ui/jetpack-compose';
import { ReactElement, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

type PagingControlsSheetProps = {
  isPresented: boolean;
  onIsPresentedChange: (isPresented: boolean) => void;
  children: ReactElement;
};

export const PagingControlsSheet = ({
  isPresented,
  onIsPresentedChange,
  children,
}: PagingControlsSheetProps) => {
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  if (!isPresented) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Host matchContents style={styles.host}>
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => onIsPresentedChange(false)}
          skipPartiallyExpanded={false}
        >
          <RNHostView matchContents>{children}</RNHostView>
        </ModalBottomSheet>
      </Host>
    </View>
  );
};

const styles = StyleSheet.create({
  host: {
    height: 1,
    width: 1,
  },
});
