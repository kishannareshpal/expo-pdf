import { PdfView } from '@kishannareshpal/expo-pdf';
import type { ContentPadding, FitMode } from '@kishannareshpal/expo-pdf';
import { Stack } from 'expo-router';
import { MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { useAssetLocalUri } from '../../lib/use-asset-local-uri';

type DocumentMode = 'standard' | 'protected';
type PasswordMode = 'none' | 'correct' | 'wrong';
type PaddingSide = keyof Required<ContentPadding>;

type PropsState = {
  documentMode: DocumentMode;
  passwordMode: PasswordMode;
  pagingEnabled: boolean;
  doubleTapToZoom: boolean;
  horizontal: boolean;
  pageGap: number;
  contentPadding: Required<ContentPadding>;
  fitMode: FitMode;
  autoScale: boolean;
  pageColorInverted: boolean;
  minScaleFactorEnabled: boolean;
  minScaleFactor: number;
};

const DEFAULT_PROPS_STATE: PropsState = {
  documentMode: 'standard',
  passwordMode: 'none',
  pagingEnabled: false,
  doubleTapToZoom: true,
  horizontal: false,
  pageGap: 12,
  contentPadding: {
    top: 24,
    right: 24,
    bottom: 24,
    left: 24,
  },
  fitMode: 'width',
  autoScale: true,
  pageColorInverted: false,
  minScaleFactorEnabled: false,
  minScaleFactor: 0.5,
};

const DOCUMENT_OPTIONS: { label: string; value: DocumentMode }[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Protected', value: 'protected' },
];

const PASSWORD_OPTIONS: { label: string; value: PasswordMode }[] = [
  { label: 'None', value: 'none' },
  { label: 'Correct', value: 'correct' },
  { label: 'Wrong', value: 'wrong' },
];

const FIT_MODE_OPTIONS: { label: string; value: FitMode }[] = [
  { label: 'Width', value: 'width' },
  { label: 'Height', value: 'height' },
  { label: 'Both', value: 'both' },
];

const PADDING_SIDES: { label: string; value: PaddingSide }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
];

const PropsExampleScreen = () => {
  const standardPdfUri = useAssetLocalUri(
    require('@assets/pdf-samples/standard.pdf')
  );
  const protectedPdfUri = useAssetLocalUri(
    require('@assets/pdf-samples/password-123456.pdf')
  );
  const [propsState, setPropsState] = useState<PropsState>(DEFAULT_PROPS_STATE);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pdfUri =
    propsState.documentMode === 'protected' ? protectedPdfUri : standardPdfUri;
  const password = getPassword(propsState.passwordMode);
  const pageLabel =
    pageCount > 0 ? `Page ${pageIndex + 1} of ${pageCount}` : 'No pages';

  const pdfKey = useMemo(
    () =>
      [
        propsState.documentMode,
        propsState.passwordMode,
        propsState.pagingEnabled,
        propsState.horizontal,
      ].join('-'),
    [
      propsState.documentMode,
      propsState.passwordMode,
      propsState.pagingEnabled,
      propsState.horizontal,
    ]
  );

  const updateState = <Key extends keyof PropsState>(
    key: Key,
    value: PropsState[Key]
  ) => {
    setPropsState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updatePadding = (side: PaddingSide, nextValue: number) => {
    setPropsState((current) => ({
      ...current,
      contentPadding: {
        ...current.contentPadding,
        [side]: clamp(nextValue, 0, 160),
      },
    }));
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{ title: 'Props', headerLargeTitleEnabled: false }}
      />

      <View
        className="border-b border-neutral-200 bg-neutral-100"
        style={{ height: '45%', minHeight: 320 }}
      >
        {pdfUri ? (
          <PdfView
            key={pdfKey}
            style={{ flex: 1 }}
            uri={pdfUri}
            password={password}
            pagingEnabled={propsState.pagingEnabled}
            doubleTapToZoom={propsState.doubleTapToZoom}
            horizontal={propsState.horizontal}
            pageGap={propsState.pageGap}
            contentPadding={propsState.contentPadding}
            minScaleFactor={
              propsState.minScaleFactorEnabled
                ? propsState.minScaleFactor
                : undefined
            }
            fitMode={propsState.fitMode}
            autoScale={propsState.autoScale}
            pageColorInverted={propsState.pageColorInverted}
            onLoadComplete={(payload) => {
              setErrorMessage(null);
              setPageIndex(0);
              setPageCount(payload.pageCount);
            }}
            onPageChanged={(payload) => {
              setPageIndex(payload.pageIndex);
              setPageCount(payload.pageCount);
            }}
            onError={(payload) => {
              setPageCount(0);
              setErrorMessage(`${payload.code}: ${payload.message}`);
            }}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-neutral-600">
              Loading sample PDF
            </Text>
          </View>
        )}
      </View>

      <View className="border-b border-neutral-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="text-sm font-semibold text-neutral-900" selectable>
            {pageLabel}
          </Text>

          <Pressable
            accessibilityRole="button"
            className="h-9 flex-row items-center gap-2 rounded-full bg-neutral-100 px-3 active:opacity-70"
            onPress={() => setPropsState(DEFAULT_PROPS_STATE)}
          >
            <RotateCcwIcon size={15} color="#171717" />
            <Text className="text-sm font-semibold text-neutral-900">
              Reset
            </Text>
          </Pressable>
        </View>

        {errorMessage ? (
          <Text className="mt-2 text-xs font-medium text-red-600" selectable>
            {errorMessage}
          </Text>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 py-5 pb-10"
        contentInsetAdjustmentBehavior="automatic"
      >
        <ControlSection title="Document">
          <SegmentedControl
            options={DOCUMENT_OPTIONS}
            value={propsState.documentMode}
            onChange={(documentMode) =>
              updateState('documentMode', documentMode)
            }
          />
          <SegmentedControl
            options={PASSWORD_OPTIONS}
            value={propsState.passwordMode}
            onChange={(passwordMode) =>
              updateState('passwordMode', passwordMode)
            }
          />
        </ControlSection>

        <ControlSection title="Behavior">
          <ToggleRow
            label="Paging enabled"
            value={propsState.pagingEnabled}
            onValueChange={(pagingEnabled) =>
              updateState('pagingEnabled', pagingEnabled)
            }
          />
          <ToggleRow
            label="Double tap to zoom"
            value={propsState.doubleTapToZoom}
            onValueChange={(doubleTapToZoom) =>
              updateState('doubleTapToZoom', doubleTapToZoom)
            }
          />
          <ToggleRow
            label="Horizontal"
            value={propsState.horizontal}
            onValueChange={(horizontal) =>
              updateState('horizontal', horizontal)
            }
          />
          <ToggleRow
            label="Auto scale"
            value={propsState.autoScale}
            onValueChange={(autoScale) => updateState('autoScale', autoScale)}
          />
          <ToggleRow
            label="Invert page colors"
            value={propsState.pageColorInverted}
            onValueChange={(pageColorInverted) =>
              updateState('pageColorInverted', pageColorInverted)
            }
          />
        </ControlSection>

        <ControlSection title="Fit mode">
          <SegmentedControl
            options={FIT_MODE_OPTIONS}
            value={propsState.fitMode}
            onChange={(fitMode) => updateState('fitMode', fitMode)}
          />
        </ControlSection>

        <ControlSection title="Spacing">
          <StepperRow
            label="Page gap"
            value={propsState.pageGap}
            min={0}
            max={160}
            step={4}
            onChange={(pageGap) => updateState('pageGap', pageGap)}
          />

          {PADDING_SIDES.map((side) => (
            <StepperRow
              key={side.value}
              label={`${side.label} padding`}
              value={propsState.contentPadding[side.value]}
              min={0}
              max={160}
              step={4}
              onChange={(nextValue) => updatePadding(side.value, nextValue)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Minimum scale">
          <ToggleRow
            label={`Enabled${Platform.OS === 'ios' ? '' : ' (iOS only)'}`}
            value={propsState.minScaleFactorEnabled}
            onValueChange={(minScaleFactorEnabled) =>
              updateState('minScaleFactorEnabled', minScaleFactorEnabled)
            }
          />
          <StepperRow
            label="Scale factor"
            value={propsState.minScaleFactor}
            min={0.1}
            max={3}
            step={0.1}
            precision={1}
            onChange={(minScaleFactor) =>
              updateState('minScaleFactor', minScaleFactor)
            }
          />
        </ControlSection>
      </ScrollView>
    </View>
  );
};

type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ControlSection = ({ title, children }: ControlSectionProps) => {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-neutral-500">{title}</Text>
      <View className="border-t border-neutral-200">{children}</View>
    </View>
  );
};

type SegmentedControlProps<Value extends string> = {
  options: { label: string; value: Value }[];
  value: Value;
  onChange: (value: Value) => void;
};

const SegmentedControl = <Value extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<Value>) => {
  return (
    <View className="flex-row gap-1 border-b border-neutral-100 py-2">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className="min-h-10 flex-1 items-center justify-center rounded-full px-3 active:opacity-70"
            onPress={() => onChange(option.value)}
            style={{ backgroundColor: selected ? '#000000' : '#f5f5f5' }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: selected ? '#ffffff' : '#171717' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const ToggleRow = ({ label, value, onValueChange }: ToggleRowProps) => {
  return (
    <View className="min-h-12 flex-row items-center justify-between gap-4 border-b border-neutral-100 py-2">
      <Text className="text-base font-medium text-neutral-900">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

type StepperRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  precision?: number;
  onChange: (value: number) => void;
};

const StepperRow = ({
  label,
  value,
  min,
  max,
  step,
  precision = 0,
  onChange,
}: StepperRowProps) => {
  return (
    <View className="min-h-12 flex-row items-center justify-between gap-4 border-b border-neutral-100 py-2">
      <Text className="flex-1 text-base font-medium text-neutral-900">
        {label}
      </Text>

      <View className="flex-row items-center gap-2">
        <IconButton
          disabled={value <= min}
          icon={MinusIcon}
          label={`Decrease ${label}`}
          onPress={() => onChange(clamp(value - step, min, max, precision))}
        />

        <Text className="w-14 text-center text-base font-semibold tabular-nums text-neutral-900">
          {value.toFixed(precision)}
        </Text>

        <IconButton
          disabled={value >= max}
          icon={PlusIcon}
          label={`Increase ${label}`}
          onPress={() => onChange(clamp(value + step, min, max, precision))}
        />
      </View>
    </View>
  );
};

type IconButtonProps = {
  disabled?: boolean;
  icon: typeof PlusIcon;
  label: string;
  onPress: () => void;
};

const IconButton = ({
  disabled = false,
  icon: Icon,
  label,
  onPress,
}: IconButtonProps) => {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="h-9 w-9 items-center justify-center rounded-full bg-neutral-100 active:opacity-70 disabled:opacity-40"
      disabled={disabled}
      onPress={onPress}
    >
      <Icon size={17} color={disabled ? '#a3a3a3' : '#171717'} />
    </Pressable>
  );
};

const getPassword = (mode: PasswordMode) => {
  switch (mode) {
    case 'correct':
      return '123456';
    case 'wrong':
      return 'wrong-password';
    case 'none':
      return undefined;
  }
};

const clamp = (value: number, min: number, max: number, precision = 0) => {
  const clamped = Math.min(max, Math.max(min, value));
  const factor = 10 ** precision;

  return Math.round(clamped * factor) / factor;
};

export default PropsExampleScreen;
