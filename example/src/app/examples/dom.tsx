import { View } from "react-native";
import { Stack } from "expo-router";
import Heading from "../../components/dom/viewer";

export default () => {
  // const pdfLocalUri = useAssetLocalUri(require('@assets/pdf-samples/standard.pdf'));

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'DOM', headerLargeTitleEnabled: false }} />

      <View className="justify-center items-center p-12">
        <Heading
          name="Kishan"
          dom={{ style: { height: 100, width: 100 } }}
        />
      </View>
    </View>
  )
}
