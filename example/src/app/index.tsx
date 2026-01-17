import { ScrollView, View } from "react-native"
import { ExampleCard } from "../components/example-card";
import { ExampleItem } from "../lib/types";
import { Stack } from "expo-router";

const EXAMPLES: ExampleItem[] = [
  {
    key: 'normal',
    title: 'Standard PDF',
    description: 'Renders a standard PDF file with multiple pages.',
    href: '/examples/standard',
  },
  {
    key: 'password-protected',
    title: 'Password protected',
    description: 'Renders a PDF file that is protected with a password.',
    href: '/examples/password-protected',
  },
  {
    key: 'content-padding',
    title: 'Content padding',
    description: 'Renders a PDF file with custom content padding around the entire document.',
    href: '/examples/content-padding',
  },
  {
    key: 'dom',
    title: 'DOM',
    description: 'Renders a PDF using React Native Webview using Expo DOM',
    href: '/examples/dom',
  },
]

const HomeScreen = () => {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'expo-pdf' }} />

      <ScrollView
        contentContainerClassName="grow pb-18"
        contentInsetAdjustmentBehavior="always"
      >
        <View className="flex-1 p-3 gap-2">
          {EXAMPLES.map((params) => (
            <ExampleCard
              key={params.key}
              title={params.title}
              description={params.description}
              href={params.href}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen;

