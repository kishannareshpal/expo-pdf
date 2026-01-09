import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { ReanimatedTrueSheet } from "@lodev09/react-native-true-sheet/reanimated"
import { ReanimatedTrueSheetProvider } from "@lodev09/react-native-true-sheet/reanimated"
import { TrueBottomSheetResponsiveView } from "./react-native-true-sheet/rnts-responsive-view"
import { PropsWithChildren, Ref } from "react"
import { ScrollView } from "react-native-gesture-handler"

type ReactNativeTrueSheetProps = PropsWithChildren<{
  ref: Ref<TrueSheet>;
}>

export const ReactNativeTrueSheet = ({ ref, children }: ReactNativeTrueSheetProps) => {
  return (
    <ReanimatedTrueSheetProvider>
      <ReanimatedTrueSheet
        ref={ref}
        detents={[0.2, 0.5, 1]}
        dimmed
        dimmedDetentIndex={1}
        scrollable
      >
        <ScrollView nestedScrollEnabled>
          <TrueBottomSheetResponsiveView className="flex-1">
            {children}
          </TrueBottomSheetResponsiveView>
        </ScrollView>
      </ReanimatedTrueSheet>
    </ReanimatedTrueSheetProvider>
  )
}
