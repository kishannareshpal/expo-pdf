import * as FileSystem from 'expo-file-system/legacy';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

export type PdfPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PaddingSide = keyof PdfPadding;

type PagingPreferencesState = {
  contentPadding: PdfPadding;
  setPaddingSide: (side: PaddingSide, value: number) => void;
  resetContentPadding: () => void;
};

export const DEFAULT_CONTENT_PADDING: PdfPadding = {
  top: 28,
  right: 28,
  bottom: 28,
  left: 28,
};

export const PADDING_STEP = 4;
export const MAX_CONTENT_PADDING = 160;

const STORAGE_ROOT_DIRECTORY =
  FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
const STORAGE_DIRECTORY = STORAGE_ROOT_DIRECTORY
  ? `${STORAGE_ROOT_DIRECTORY}preferences/`
  : null;

const fileSystemStorage: StateStorage = {
  getItem: async (name) => {
    const fileUri = getStorageFileUri(name);

    if (!fileUri) {
      return null;
    }

    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      return null;
    }

    return FileSystem.readAsStringAsync(fileUri);
  },
  setItem: async (name, value) => {
    const fileUri = getStorageFileUri(name);

    if (!fileUri || !STORAGE_DIRECTORY) {
      return;
    }

    await ensureStorageDirectory();
    await FileSystem.writeAsStringAsync(fileUri, value);
  },
  removeItem: async (name) => {
    const fileUri = getStorageFileUri(name);

    if (!fileUri) {
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  },
};

export const usePagingPreferencesStore = create<PagingPreferencesState>()(
  persist(
    (set) => ({
      contentPadding: DEFAULT_CONTENT_PADDING,
      setPaddingSide: (side, value) =>
        set((state) => ({
          contentPadding: {
            ...state.contentPadding,
            [side]: clampPadding(value),
          },
        })),
      resetContentPadding: () =>
        set({ contentPadding: DEFAULT_CONTENT_PADDING }),
    }),
    {
      name: 'expo-pdf-paging-preferences',
      storage: createJSONStorage(() => fileSystemStorage),
      partialize: (state) => ({ contentPadding: state.contentPadding }),
    }
  )
);

const getStorageFileUri = (name: string) => {
  if (!STORAGE_DIRECTORY) {
    return null;
  }

  return `${STORAGE_DIRECTORY}${encodeURIComponent(name)}.json`;
};

const ensureStorageDirectory = async () => {
  if (!STORAGE_DIRECTORY) {
    return;
  }

  const directoryInfo = await FileSystem.getInfoAsync(STORAGE_DIRECTORY);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(STORAGE_DIRECTORY, {
      intermediates: true,
    });
  }
};

const clampPadding = (value: number) =>
  Math.min(MAX_CONTENT_PADDING, Math.max(0, Math.round(value)));
