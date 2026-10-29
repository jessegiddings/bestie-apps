import { evaluate, FREE, initVoice } from '@bestie/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerHostClips } from '@/content/host';
import { purchases } from '@/services/purchases';
import { useParty } from '@/state/store';
import { colors } from '@/ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
registerHostClips();

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(useParty.persist.hasHydrated());
  useEffect(() => {
    const off = useParty.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useParty.persist.hasHydrated());
    return off;
  }, []);
  const [loaded, fontError] = useFonts({
    Fraunces_600SemiBold: require('../assets/fonts/Fraunces_600SemiBold.ttf'),
    PlusJakartaSans_500Medium: require('../assets/fonts/PlusJakartaSans_500Medium.ttf'),
    PlusJakartaSans_700Bold: require('../assets/fonts/PlusJakartaSans_700Bold.ttf'),
  });

  useEffect(() => {
    if (hydrated && (loaded || fontError)) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, fontError, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let disposed = false;
    let off: (() => void) | undefined;
    const state = useParty.getState();
    if (state.entitlement.source === 'mock' && !purchases.simulated) state.setEntitlement(FREE);
    void initVoice({ storageKey: 'party-game-voice-v1' });
    void (async () => {
      try {
        await purchases.configure();
        const unsubscribe = await purchases.subscribe(e => { if (!disposed) useParty.getState().setEntitlement(e); });
        if (disposed) unsubscribe(); else off = unsubscribe;
        const live = await purchases.current();
        if (!disposed) useParty.getState().setEntitlement(live ?? evaluate(useParty.getState().entitlement, new Date().toISOString()));
      } catch { /* Offline tracking and preview remain available. */ }
    })();
    return () => { disposed = true; off?.(); };
  }, [hydrated]);
  if (!hydrated || (!loaded && !fontError)) return null;

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
