import { evaluate, initVoice } from '@bestie/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerHostClips } from '@/content/host';
import { purchases } from '@/services/purchases';
import { useParty } from '@/state/store';
import { colors } from '@/ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
registerHostClips();

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    PlusJakartaSans_500Medium: require('../assets/fonts/PlusJakartaSans_500Medium.ttf'),
    PlusJakartaSans_700Bold: require('../assets/fonts/PlusJakartaSans_700Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || fontError) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, fontError]);

  useEffect(() => {
    void initVoice({ storageKey: 'party-game-voice-v1' });
    void (async () => {
      await purchases.configure();
      const live = await purchases.current();
      const st = useParty.getState();
      st.setEntitlement(live ?? evaluate(st.entitlement, new Date().toISOString()));
    })();
  }, []);

  if (!loaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="players" />
        <Stack.Screen name="night" options={{ gestureEnabled: false }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
