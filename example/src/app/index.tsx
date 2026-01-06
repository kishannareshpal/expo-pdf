import { ScrollView, Text, View } from "react-native"
import { useAtom } from "jotai"
import { ExampleKey, exampleSelectorAtom } from "../lib/atoms"
import { Pressable } from 'react-native'
import { Link } from 'expo-router';
import { ComponentProps } from "react";

const EXAMPLES: Array<{
  key: ExampleKey,
  title: string,
  description: string,
  href: ComponentProps<typeof Link>['href']
}> = [
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
  ]

export const HomeScreen = () => {
  const [selectedExample, setExample] = useAtom(exampleSelectorAtom);

  const renderList = () => {
    return (
      <ScrollView>
        <View className="flex-1 p-3 pt-5 gap-2">
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
    )
  }

  return (
    <View className="flex-1">
      renderExamplesList()
    </View>
  )
}

type ExampleCardProps = {
  title: string;
  description: string;
  href: ComponentProps<typeof Link>['href']
}

export const ExampleCard = ({ title, description, href }: ExampleCardProps) => {
  return (
    <Link href={href} asChild>
      <Pressable className="bg-neutral-100 border-neutral-200 border-2 rounded-3xl p-4 active:opacity-50">
        <Text className="font-bold text-lg">{title}</Text>
        <Text>{description}</Text>

        <Text className="mt-3 text-xs text-neutral-500">Tap to open</Text>
      </Pressable>
    </Link>
  )
}
