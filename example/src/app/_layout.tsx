import '../global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { View } from 'react-native';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <Stack screenOptions={{ headerLargeTitleEnabled: true, headerBackButtonDisplayMode: 'minimal' }} />
      </View>
    </SafeAreaProvider>
  );
}

export default RootLayout
