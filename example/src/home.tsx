import { ScrollView, Text, View } from "react-native"
import { Example } from "./components/example"
import { useAtom } from "jotai"
import { exampleSelectorAtom } from "./lib/atoms"
import { Pressable } from 'react-native'

export const HomeScreen = () => {
  const [selectedExample, setExample] = useAtom(exampleSelectorAtom);

  const renderExample = () => {
    switch (selectedExample) {
      case 'normal':
        return <Example.Normal />;
      case 'password-protected':
        return <Example.PasswordProtected />;
      case 'content-padding':
        return <Example.ContentPadding />;
      default:
        return null;
    }
  }

  const renderExamplesList = () => {
    return (
      <ScrollView>
        <View className="flex-1 p-2 gap-2">
          <ExampleCard
            title="Normal PDF"
            description="Renders a standard PDF file with multiple pages."
            onPress={() => setExample('normal')}
          />

          <ExampleCard
            title="Password protected"
            description="Renders a PDF file that is protected with a password."
            onPress={() => setExample('password-protected')}
          />

          <ExampleCard
            title="Content padding"
            description="Renders a PDF file with custom content padding around the entire document."
            onPress={() => setExample('content-padding')}
          />
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="flex-1">
      {!selectedExample ? (
        renderExamplesList()
      ) : (
        renderExample()
      )}
    </View>
  )
}

type ExampleCardProps = {
  title: string;
  description: string;
  onPress: () => void;
}

export const ExampleCard = ({ title, description, onPress }: ExampleCardProps) => {
  return (
    <Pressable
      className="bg-neutral-100 border-neutral-200 border-2 rounded-3xl p-4 active:opacity-50"
      onPress={onPress}
    >
      <Text className="font-bold text-lg">{title}</Text>
      <Text>{description}</Text>

      <Text className="mt-3 text-xs text-neutral-500">Tap to open</Text>
    </Pressable>
  )
}
