import { Platform, Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf/legacy";
import { Stack } from "expo-router";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { PressableScale as PSPrimitive } from 'pressto';
import { withUniwind } from "uniwind";
import { PanelBottomOpenIcon } from "lucide-react-native";
import { ReactNativeTrueSheet } from "../../components/bottom-sheet/react-native-true-sheet";
import { GorhomBottomSheet } from "../../components/bottom-sheet/gorhom-bottom-sheet";
const PressableScale = withUniwind(PSPrimitive);

const BottomSheetScreen = () => {
  const trueBottomSheetRef = useRef<TrueSheet>(null);
  const gorhomBottomSheetRef = useRef<BottomSheetModal>(null)

  const handleShowSheet = (type: 'gorhom/bottom-sheet' | 'react-native-true-sheet') => {
    if (type === 'gorhom/bottom-sheet') {
      gorhomBottomSheetRef.current?.present();
    } else if (type === 'react-native-true-sheet') {
      trueBottomSheetRef.current?.present();
    }
  }

  return (
    <View className="flex-1 bg-neutral-200 pb-safe relative">
      <Stack.Screen options={{ title: 'Bottom Sheet', headerLargeTitleEnabled: false }} />

      <View className="flex-1 justify-start items-center gap-4 my-12">
        <Text className="text-lg text-neutral-400">Select a sheet implementation to launch</Text>

        <View className="flex-col gap-3 items-center">
          <Button title="Launch @gorhom/bottom-sheet" onPress={() => handleShowSheet('gorhom/bottom-sheet')} />

          {Platform.OS === 'ios' ? (
            <Button title="Launch @lodev09/react-native-true-sheet" onPress={() => handleShowSheet('react-native-true-sheet')} />
          ) : null}
        </View>
      </View>

      <ReactNativeTrueSheet ref={trueBottomSheetRef}>
        {/* <Pdf /> */}
      </ReactNativeTrueSheet>

      <GorhomBottomSheet ref={gorhomBottomSheetRef}>
        <Pdf />
      </GorhomBottomSheet>
    </View>
  )
}

const Button = ({ title, onPress }: { title: string, onPress: () => void }) => {
  return (
    <PressableScale className="px-4 py-3 flex-row gap-2 items-center bg-blue-600 rounded-full" onPress={onPress}>
      <PanelBottomOpenIcon color="white" size={22} />
      <Text className="text-white text-sm font-medium">{title}</Text>
    </PressableScale>
  )
}

const Pdf = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/standard.pdf'));
  const insets = useSafeAreaInsets();

  if (!pdfLocalUri) {
    return (
      <Text>Missing PDF</Text>
    )
  }

  return (
    <PdfView
      style={{ flex: 1 }}
      uri={pdfLocalUri}
      autoScale={false}
      contentPadding={{ bottom: insets.bottom + 24 }}
      pageGap={12}
      fitMode="width"
      onLoadComplete={(payload) => console.log("[expo-pdf] onLoadComplete", payload)}
      onError={(payload) => console.debug('[expo-pdf] onError', payload)}
    />
  )
}

export default BottomSheetScreen;
