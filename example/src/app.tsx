import { PdfView, OnErrorEventPayload, OnLoadCompleteEventPayload, OnPageChangedEventPayload } from '@kishannareshpal/expo-pdf';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Content />
    </SafeAreaProvider>
  );
}

export const Content = () => {
  const insets = useSafeAreaInsets();

  const [pageChangedPayload, setPageChangedPayload] = useState<OnPageChangedEventPayload>();
  const [loadCompletePayload, setLoadCompletePayload] = useState<OnLoadCompleteEventPayload>();
  const [errorPayload, setErrorPayload] = useState<OnErrorEventPayload>();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 12, paddingTop: insets.top + 12, paddingBottom: 12, borderColor: '#292929', borderBottomWidth: 1, backgroundColor: '#171717' }}>
        <Text style={{ color: 'white' }}>@kishannareshpal/expo-pdf</Text>
      </View>

      <PdfView
        style={{ flex: 1 }}
        uri="https://www.lysator.liu.se/mit-guide/MITLockGuide.pdf"
        onLoadComplete={setLoadCompletePayload}
        onPageChanged={setPageChangedPayload}
        onError={setErrorPayload}
      />

      <View style={{ paddingHorizontal: 12, paddingTop: 12, borderColor: '#292929', borderBottomWidth: 1, backgroundColor: '#000' }}>
        <ScrollView horizontal contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}>
          <View>
            <Text style={{ color: 'white' }}>Events:</Text>
            <Text style={{ color: 'white' }}>- onLoadComplete: {JSON.stringify(loadCompletePayload)}</Text>
            <Text style={{ color: 'white' }}>- onPageChanged: {JSON.stringify(pageChangedPayload)}</Text>
            <Text style={{ color: 'white' }}>- onError: {JSON.stringify(errorPayload)}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}