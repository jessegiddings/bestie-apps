import { evaluate, initVoice } from '@bestie/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerAllClips } from '@/content/clips';
import { purchases } from '@/services/purchases';
import { useDry } from '@/state/store';
import { colors } from '@/ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
registerAllClips();

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    PlusJakartaSans_500Medium: require('../assets/fonts/PlusJakartaSans_500Medium.ttf'),
    PlusJakartaSans_700Bold: require('../assets/fonts/PlusJakartaSans_700Bold.ttf'),
    Fraunces_600SemiBold: require('../assets/fonts/Fraunces_600SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded || fontError) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, fontError]);

  useEffect(() => {
    void initVoice({ storageKey: 'dry-tracker-voice-v1' });
    void (async () => {
      await purchases.configure();
      const live = await purchases.current();
      const st = useDry.getState();
      st.setEntitlement(live ?? evaluate(st.entitlement, new Date().toISOString()));
    })();
  }, []);

  if (!loaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="journey" options={{ animation: 'none' }} />
        <Stack.Screen name="badges" options={{ animation: 'none' }} />
        <Stack.Screen name="buddy" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="craving" options={{ presentation: 'modal' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
