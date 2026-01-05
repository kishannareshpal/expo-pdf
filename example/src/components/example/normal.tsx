import { Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";

export const Normal = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/normal.pdf'));

  return (
    <View className="flex-1">
      {pdfLocalUri ? (
        <PdfView
          style={{ flex: 1, backgroundColor: 'blue' }}
          uri={pdfLocalUri}
          pageGap={12}
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
