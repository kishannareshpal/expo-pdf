import { View } from "react-native"
import { Header } from "./header"
import { PropsWithChildren } from "react"

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <View className="flex-1">
      <Header />

      {children}
    </View>
  )
}
