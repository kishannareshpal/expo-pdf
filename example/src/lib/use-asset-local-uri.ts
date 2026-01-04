import { useAssets } from "expo-asset"
import { useEffect, useState } from "react";

export const useAssetLocalUri = (moduleId: number): string | null => {
  const [assets] = useAssets([moduleId]);

  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!assets?.length) {
      return;
    }

    assets[0].downloadAsync()
      .then((asset) => setUri(asset.localUri))
      .catch(console.error)
  }, [assets])

  return uri;
}
