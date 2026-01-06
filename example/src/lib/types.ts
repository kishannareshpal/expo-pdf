import { Link } from "expo-router"
import { ComponentProps } from "react"

export type ExampleItem = {
  key: string,
  title: string,
  description: string,
  href: ComponentProps<typeof Link>['href']
}
