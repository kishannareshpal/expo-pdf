import { PdfBookmark, PdfView, PdfViewRef } from '@kishannareshpal/expo-pdf';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useAssetLocalUri } from '../../lib/use-asset-local-uri';

function bookmarkRows(
  bookmarks: PdfBookmark[],
  depth = 0
): { bookmark: PdfBookmark; depth: number }[] {
  return bookmarks.flatMap((bookmark) => [
    { bookmark, depth },
    ...bookmarkRows(bookmark.children, depth + 1),
  ]);
}

export default function BookmarksExampleScreen() {
  const uri = useAssetLocalUri(
    require('@assets/pdf-samples/bookmarks-annotations.pdf')
  );
  const pdf = useRef<PdfViewRef>(null);
  const [bookmarks, setBookmarks] = useState<PdfBookmark[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: 'Bookmarks and annotations',
          headerLargeTitleEnabled: false,
        }}
      />
      <View className="p-4 gap-2">
        <Text>
          Page {page} of 2. The red rectangle on page 1 is an existing PDF
          annotation.
        </Text>
        {error && <Text accessibilityRole="alert">{error}</Text>}
      </View>
      <FlatList
        style={{ flexGrow: 0, maxHeight: 160 }}
        data={bookmarkRows(bookmarks)}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item: { bookmark, depth } }) => (
          <Pressable
            accessibilityRole="button"
            disabled={bookmark.pageIndex === null}
            style={{ padding: 12, paddingLeft: 16 + depth * 20 }}
            onPress={() => {
              if (bookmark.pageIndex !== null) {
                void pdf.current
                  ?.goToPage(bookmark.pageIndex)
                  .catch((reason: Error) => setError(reason.message));
              }
            }}
          >
            <Text>{bookmark.title}</Text>
          </Pressable>
        )}
      />
      {uri && (
        <PdfView
          ref={pdf}
          style={{ flex: 1 }}
          uri={uri}
          onLoadComplete={async () => {
            try {
              setBookmarks((await pdf.current?.getBookmarks()) ?? []);
            } catch (reason) {
              setError(String(reason));
            }
          }}
          onPageChanged={({ pageIndex }) => setPage(pageIndex + 1)}
          onError={({ message }) => setError(message)}
        />
      )}
    </View>
  );
}
