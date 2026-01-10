import '../global.css'
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Uniwind } from 'uniwind';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
          <View className="flex-1">
            <Stack screenOptions={{ headerLargeTitleEnabled: true, headerBackButtonDisplayMode: 'minimal' }} />
          </View>
        </SafeAreaListener>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout
