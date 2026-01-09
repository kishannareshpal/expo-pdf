import { UnfoldVertical } from 'lucide-react-native';
import { withUniwind } from "uniwind";

import { PressableScale as PSPrimitive } from 'pressto';
const PressableScale = withUniwind(PSPrimitive);

export const RegularHandle = () => {
  return (
    <PressableScale className="px-4 py-1 items-center justify-center flex-row gap-2 bg-blue-600 rounded-full">
      <UnfoldVertical color="white" size={18} />
    </PressableScale>
  )
}
