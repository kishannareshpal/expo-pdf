import { Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";

export const ContentPadding = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/normal.pdf'));

  return (
    <View className="flex-1">
      {pdfLocalUri ? (
        <PdfView
          style={{ flex: 1, backgroundColor: 'orange' }}
          uri={pdfLocalUri}
          pageGap={12}
          contentPadding={{
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
          }}
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
