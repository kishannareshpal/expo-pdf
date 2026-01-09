import { Platform, StatusBar, useWindowDimensions, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GorhomBottomSheetResponsiveViewProps = ViewProps;

/**
 * @description A responsive view that will always be the full height of the @gorhom/bottom-sheet component regardless of the detent.
 *
 * @remark @gorhom/bottom-sheet will always be whatever the height of its parent is (if a header is specified in the screen it may be positioned below it).
 * This component uses the current y position of the sheet's top to calculate the current height of the sheet by subtracting it to the screen's height and the header height.
 * - Not to be used when the bottom sheet has set dynamic sizing enabled. This only makes sense when it's disabled / statically sized.
 */
export const GorhomBottomSheetResponsiveView = ({ children, ...props }: GorhomBottomSheetResponsiveViewProps) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { animatedPosition, } = useBottomSheet();

  const fullHeightStyle = useAnimatedStyle(() => ({
    height: height - animatedPosition.value - insets.top,
  }));

  return (
    <Animated.View style={fullHeightStyle}>
      <View {...props}>
        {children}
      </View>
    </Animated.View>
  )
}
