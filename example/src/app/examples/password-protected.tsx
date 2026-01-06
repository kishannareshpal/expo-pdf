import { Text, View } from "react-native";
import { useAssetLocalUri } from "../../lib/use-asset-local-uri";
import { PdfView } from "@kishannareshpal/expo-pdf";
import { Stack } from "expo-router";

const PasswordProtectedExampleScreen = () => {
  const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/password-123456.pdf'));

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Password protected', headerLargeTitleEnabled: false }} />

      {pdfLocalUri ? (
        <PdfView
          style={{ flex: 1 }}
          uri={pdfLocalUri}
          pageGap={12}
          password="123456"
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

export default PasswordProtectedExampleScreen;
