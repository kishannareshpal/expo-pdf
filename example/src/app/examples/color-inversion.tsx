import { Pressable, Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";
import { Stack } from "expo-router";
import { useState } from "react";
import { BlendIcon } from "lucide-react-native";

const ColorInversionExampleScreen = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/standard.pdf'));
  const [pageColorInverted, setPageColorInverted] = useState(true);

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Color inversion', headerLargeTitleEnabled: false }} />

      <View className="flex-row justify-center items-center gap-2 p-3">
        <Pressable
          className="rounded-full bg-black p-2 flex-row items-center gap-2"
          onPress={() => setPageColorInverted((inverted) => !inverted)}
        >
          <BlendIcon size={18} color="white" />
          <Text className="text-white">Toggle</Text>
        </Pressable>
      </View>

      {pdfLocalUri ? (
        <PdfView
          style={{ flex: 1 }}
          uri={pdfLocalUri}
          pageGap={12}
          pageColorInverted={pageColorInverted}
          onError={(payload) => console.debug('[expo-pdf] onError', payload)}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>Please load a sample file</Text>
        </View>
      )}
    </View>
  )
}

export default ColorInversionExampleScreen;
