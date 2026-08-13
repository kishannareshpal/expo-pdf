import { BottomSheet, Group, Host, RNHostView } from '@expo/ui/swift-ui';
import {
  presentationDetents,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';
import { ReactElement } from 'react';
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
  if (!isPresented) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Host style={StyleSheet.absoluteFill}>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={onIsPresentedChange}
        >
          <Group
            modifiers={[
              presentationDetents([{ height: 430 }, 'medium']),
              presentationDragIndicator('visible'),
            ]}
          >
            <RNHostView matchContents>{children}</RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </View>
  );
};
