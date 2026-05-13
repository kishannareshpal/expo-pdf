import { PdfView } from '@kishannareshpal/expo-pdf';
import { Stack } from 'expo-router';
import {
  GalleryHorizontalIcon,
  GalleryVerticalIcon,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useAssetLocalUri } from '../../lib/use-asset-local-uri';

type PagingMode = 'vertical' | 'horizontal';

const PAGING_MODES: PagingMode[] = ['vertical', 'horizontal'];

const PagingExampleScreen = () => {
  const pdfLocalUri = useAssetLocalUri(
    require('@assets/pdf-samples/standard.pdf')
  );
  const [mode, setMode] = useState<PagingMode>('vertical');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const isHorizontal = mode === 'horizontal';
  const pageLabel =
    pageCount > 0 ? `Page ${pageIndex + 1} of ${pageCount}` : 'Loading pages';

  const handleModeChange = useCallback((nextMode: PagingMode) => {
    setMode(nextMode);
    setPageIndex(0);
    setPageCount(0);
  }, []);

  return (
    <View className="flex-1 bg-neutral-100">
      <Stack.Screen
        options={{ title: 'Paging', headerLargeTitleEnabled: false }}
      />

      <View className="flex-row items-center justify-between gap-3 border-b border-neutral-200 bg-white px-3 py-2">
        <View className="flex-row rounded-full bg-neutral-100 p-1">
          {PAGING_MODES.map((pagingMode) => (
            <PagingModeButton
              key={pagingMode}
              mode={pagingMode}
              selected={mode === pagingMode}
              onPress={() => handleModeChange(pagingMode)}
            />
          ))}
        </View>

        <Text className="text-sm font-medium text-neutral-500" selectable>
          {pageLabel}
        </Text>
      </View>

      {pdfLocalUri ? (
        <PdfView
          key={mode}
          style={{ flex: 1 }}
          uri={pdfLocalUri}
          pagingEnabled
          horizontal={isHorizontal}
          // pageGap={100}
          // fitMode="width"
          contentPadding={{ top: 20, left: 20, right: 20, bottom: 20 }}
          onLoadComplete={(payload) => {
            setPageIndex(0);
            setPageCount(payload.pageCount);
          }}
          onPageChanged={(payload) => {
            setPageIndex(payload.pageIndex);
            setPageCount(payload.pageCount);
          }}
          onError={(payload) => console.debug('[expo-pdf] onError', payload)}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>Please load a sample file</Text>
        </View>
      )}
    </View>
  );
};

type PagingModeButtonProps = {
  mode: PagingMode;
  selected: boolean;
  onPress: () => void;
};

const PagingModeButton = ({
  mode,
  selected,
  onPress,
}: PagingModeButtonProps) => {
  const Icon =
    mode === 'vertical' ? GalleryVerticalIcon : GalleryHorizontalIcon;
  const label = mode === 'vertical' ? 'Vertical' : 'Horizontal';
  const foregroundColor = selected ? '#ffffff' : '#404040';

  return (
    <Pressable
      className="flex-row items-center gap-2 rounded-full px-3 py-2 active:opacity-70"
      onPress={onPress}
      style={{ backgroundColor: selected ? '#000000' : 'transparent' }}
    >
      <Icon size={16} color={foregroundColor} />
      <Text className="text-sm font-medium" style={{ color: foregroundColor }}>
        {label}
      </Text>
    </Pressable>
  );
};

export default PagingExampleScreen;
