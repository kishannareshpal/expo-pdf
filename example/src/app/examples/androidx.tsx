import { SpecView } from "@kishannareshpal/expo-pdf"
import { Text, View } from "react-native"
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";

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
      <SpecView uri={pdfLocalUri} style={{ width: 200, height: 200, borderWidth: 1, borderColor: 'black' }} />
    </View>
  )
}
