import { GlassView } from "expo-glass-effect"
import { UnfoldVertical } from "lucide-react-native"

export const GlassHandle = () => {
  return (
    <GlassView
      isInteractive
      glassEffectStyle="clear"
      tintColor="#155dfc"
      style={{ paddingVertical: 4, paddingHorizontal: 16, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}
    >
      <UnfoldVertical color="white" size={18} />
    </GlassView>
  )
}
