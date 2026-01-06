import './global.css'
import { Layout } from '../components/layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Layout>
        <Stack />
      </Layout>
    </SafeAreaProvider>
  );
}

export default RootLayout
