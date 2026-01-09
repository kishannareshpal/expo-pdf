import React from "react";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export const GorhomBottomSheetBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }, containerAnimatedStyle]} />
  )
};
