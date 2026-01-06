import { Link } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

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
