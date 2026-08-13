import { PdfView } from '@kishannareshpal/expo-pdf';
import { Stack } from 'expo-router';
import {
  GalleryHorizontalIcon,
  GalleryVerticalIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useAssetLocalUri } from '../../lib/use-asset-local-uri';
import { PagingControlsSheet } from './paging-controls-sheet';
import {
  MAX_CONTENT_PADDING,
  PADDING_STEP,
  usePagingPreferencesStore,
} from './paging-preferences-store';
import type { PaddingSide, PdfPadding } from './paging-preferences-store';

type PagingMode = 'vertical' | 'horizontal';

const PAGING_MODES: PagingMode[] = ['vertical', 'horizontal'];
const PADDING_SIDES: { side: PaddingSide; label: string }[] = [
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'bottom', label: 'Bottom' },
  { side: 'left', label: 'Left' },
];

const PagingExampleScreen = () => {
  const pdfLocalUri = useAssetLocalUri(
    require('@assets/pdf-samples/standard.pdf')
  );
  const contentPadding = usePagingPreferencesStore(
    (state) => state.contentPadding
  );
  const setPaddingSide = usePagingPreferencesStore(
    (state) => state.setPaddingSide
  );
  const resetContentPadding = usePagingPreferencesStore(
    (state) => state.resetContentPadding
  );
  const [mode, setMode] = useState<PagingMode>('vertical');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isControlsPresented, setIsControlsPresented] = useState(false);

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
        <Pressable
          accessibilityLabel="Open paging controls"
          accessibilityRole="button"
          className="h-10 flex-row items-center gap-2 rounded-full bg-neutral-100 px-4 active:opacity-70"
          onPress={() => setIsControlsPresented(true)}
        >
          <SlidersHorizontalIcon size={18} color="#171717" />
          <Text className="text-sm font-semibold text-neutral-900">
            Controls
          </Text>
        </Pressable>

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
          pageGap={28}
          // fitMode="width"
          contentPadding={contentPadding}
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

      <PagingControlsSheet
        isPresented={isControlsPresented}
        onIsPresentedChange={setIsControlsPresented}
      >
        <PagingControlsContent
          mode={mode}
          contentPadding={contentPadding}
          onClose={() => setIsControlsPresented(false)}
          onModeChange={handleModeChange}
          onPaddingChange={setPaddingSide}
          onResetPadding={resetContentPadding}
        />
      </PagingControlsSheet>
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

type PagingControlsContentProps = {
  mode: PagingMode;
  contentPadding: PdfPadding;
  onClose: () => void;
  onModeChange: (mode: PagingMode) => void;
  onPaddingChange: (side: PaddingSide, value: number) => void;
  onResetPadding: () => void;
};

const PagingControlsContent = ({
  mode,
  contentPadding,
  onClose,
  onModeChange,
  onPaddingChange,
  onResetPadding,
}: PagingControlsContentProps) => {
  return (
    <View className="w-full gap-6 bg-white px-5 pb-8 pt-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-neutral-950">Controls</Text>

        <IconButton
          accessibilityLabel="Close controls"
          icon={XIcon}
          onPress={onClose}
        />
      </View>

      <View className="gap-3">
        <Text className="text-sm font-semibold text-neutral-500">
          Direction
        </Text>

        <View className="self-start flex-row rounded-full bg-neutral-100 p-1">
          {PAGING_MODES.map((pagingMode) => (
            <PagingModeButton
              key={pagingMode}
              mode={pagingMode}
              selected={mode === pagingMode}
              onPress={() => onModeChange(pagingMode)}
            />
          ))}
        </View>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-neutral-500">
            Content padding
          </Text>

          <IconButton
            accessibilityLabel="Reset content padding"
            icon={RotateCcwIcon}
            onPress={onResetPadding}
          />
        </View>

        <View>
          {PADDING_SIDES.map(({ side, label }) => (
            <PaddingControlRow
              key={side}
              label={label}
              value={contentPadding[side]}
              onDecrease={() =>
                onPaddingChange(side, contentPadding[side] - PADDING_STEP)
              }
              onIncrease={() =>
                onPaddingChange(side, contentPadding[side] + PADDING_STEP)
              }
            />
          ))}
        </View>
      </View>
    </View>
  );
};

type PaddingControlRowProps = {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const PaddingControlRow = ({
  label,
  value,
  onDecrease,
  onIncrease,
}: PaddingControlRowProps) => {
  return (
    <View className="min-h-12 flex-row items-center justify-between gap-4 border-t border-neutral-100 py-2">
      <Text className="w-16 text-base font-medium text-neutral-900">
        {label}
      </Text>

      <View className="flex-row items-center gap-2">
        <IconButton
          accessibilityLabel={`Decrease ${label.toLowerCase()} padding`}
          disabled={value <= 0}
          icon={MinusIcon}
          onPress={onDecrease}
        />

        <Text className="w-12 text-center text-base font-semibold tabular-nums text-neutral-900">
          {value}
        </Text>

        <IconButton
          accessibilityLabel={`Increase ${label.toLowerCase()} padding`}
          disabled={value >= MAX_CONTENT_PADDING}
          icon={PlusIcon}
          onPress={onIncrease}
        />
      </View>
    </View>
  );
};

type IconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: typeof MinusIcon;
  onPress: () => void;
};

const IconButton = ({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  onPress,
}: IconButtonProps) => {
  const color = disabled ? '#a3a3a3' : '#171717';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100 active:opacity-70 disabled:opacity-40"
      disabled={disabled}
      onPress={onPress}
    >
      <Icon size={17} color={color} />
    </Pressable>
  );
};

export default PagingExampleScreen;
