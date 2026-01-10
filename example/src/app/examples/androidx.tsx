import { Text, View } from "react-native"
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";

export default () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/standard.pdf'));

  if (!pdfLocalUri) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-400">
        <Text>No PDF found</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center items-center bg-blue-400">
      <PdfView uri={pdfLocalUri} style={{ flex: 1, width: '100%', backgroundColor: 'red' }} />
    </View>
  )
}
