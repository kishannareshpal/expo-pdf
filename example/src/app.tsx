import './global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './home';
import { Layout } from './components/layout';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Layout>
        <HomeScreen />
      </Layout>
    </SafeAreaProvider>
  );
}

