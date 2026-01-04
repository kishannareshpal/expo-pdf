import { Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAssetLocalUri } from './lib/use-pdf-uri';
import { PdfView } from '@kishannareshpal/expo-pdf';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Content />
    </SafeAreaProvider>
  );
}

export const Content = () => {
  const insets = useSafeAreaInsets();
  const samplePdfUri = useAssetLocalUri(require('./assets/samples/sample.pdf'));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 12, paddingTop: insets.top + 12, paddingBottom: 12, borderColor: '#292929', borderBottomWidth: 1, backgroundColor: '#171717' }}>
        <Text style={{ color: 'white' }}>@kishannareshpal/expo-pdf</Text>
      </View>

      <View style={{ flex: 1 }}>
        {samplePdfUri ? (
          <PdfView
            style={{ flex: 1, backgroundColor: 'green' }}
            uri={samplePdfUri}
            pageGap={0}
            password="123456"
            onPageChanged={(payload) => console.debug('[expo-pdf] onPageChanged', payload)}
            onLoadComplete={(payload) => console.debug('[expo-pdf] onLoadComplete', payload)}
            onError={(payload) => console.debug('[expo-pdf] onError', payload)}
          />
        ) : null}
      </View>
    </View>
  )
}
