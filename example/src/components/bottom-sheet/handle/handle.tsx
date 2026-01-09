import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { GlassHandle } from "./glass-handle"
import { RegularHandle } from './regular-handle'

export const Handle = () => {
  if (isLiquidGlassAvailable()) {
    return <GlassHandle />
  }

  return <RegularHandle />
}
