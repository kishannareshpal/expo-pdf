import { useAtom } from "jotai";
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { exampleSelectorAtom } from "../lib/atoms";

export const Header = () => {
  const insets = useSafeAreaInsets();
  const [selectedExample, setExample] = useAtom(exampleSelectorAtom);

  return (
    <View
      className="px-3 pb-3 border-b bg-neutral-800 flex-row justify-center items-center gap-2"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-1">
        <Text className="text-white">@kishannareshpal/expo-pdf</Text>
        {selectedExample ? (
          <Text className="text-neutral-400">Example: {selectedExample}</Text>
        ) : null}
      </View>

      {selectedExample ? (
        <Pressable onPress={() => setExample(null)}>
          <Text className="font-bold text-red-400">Close</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
