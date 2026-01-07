import { Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";
import { Stack } from "expo-router";

const ContentPaddingExampleScreen = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/standard.pdf'));

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Content padding', headerLargeTitleEnabled: false }} />

      {pdfLocalUri ? (
        <PdfView
          style={{ flex: 1 }}
          uri={pdfLocalUri}
          pageGap={8}
          contentPadding={{ top: 25, left: 25, right: 25, bottom: 25 }}
          fitMode="width"
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

export default ContentPaddingExampleScreen;
