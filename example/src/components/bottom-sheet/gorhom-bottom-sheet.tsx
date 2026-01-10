import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GorhomBottomSheetResponsiveView } from "./gorhom-bottom-sheet/gbs-responsive-view";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { PropsWithChildren, Ref } from "react";
import { GorhomBottomSheetBackdrop } from "./gorhom-bottom-sheet/gbs-backdrop";
import { Handle } from "./handle/handle";

type GorhomBottomSheetProps = PropsWithChildren<{
  ref: Ref<BottomSheetModal>;
}>

export const GorhomBottomSheet = ({ ref, children }: GorhomBottomSheetProps) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['30%', '50%', '100%']}
      handleComponent={() => (
        <View className="absolute w-full justify-center items-center top-2">
          <Handle />
        </View>
      )}
      backdropComponent={GorhomBottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      topInset={insets.top}
      backgroundComponent={() => null}
    >
      <GorhomBottomSheetResponsiveView className="flex-1 overflow-hidden bg-white rounded-t-4xl">
        {children}
      </GorhomBottomSheetResponsiveView>
    </BottomSheetModal>
  )
}
