import { useReanimatedTrueSheet } from "@lodev09/react-native-true-sheet/reanimated";
import { useWindowDimensions, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

type TrueBottomSheetResponsiveViewProps = ViewProps;

/**
 * @description A responsive view that will always be the full height of the <TrueBottomSheet /> component regardless of the detent.
 *
 * @remark TrueBottomSheet will always be the full height of the screen. This component uses the current y position of the sheet's top
 * to calculate the current height of the sheet by subtracting it to the screen's height.
 */
export const TrueBottomSheetResponsiveView = ({ children, ...props }: TrueBottomSheetResponsiveViewProps) => {
  const { height } = useWindowDimensions();
  const { animatedPosition } = useReanimatedTrueSheet();

  const fullHeightStyle = useAnimatedStyle(() => ({
    height: height - animatedPosition.value
  }))

  return (
    <Animated.View style={fullHeightStyle}>
      <View {...props}>
        {children}
      </View>
    </Animated.View>
  )
}
