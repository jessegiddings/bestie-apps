import { evaluate, FREE, initVoice } from '@bestie/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerAllClips } from '@/content/clips';
import { purchases } from '@/services/purchases';
import { usePep } from '@/state/store';
import { colors } from '@/ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
registerAllClips();

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(usePep.persist.hasHydrated());
  useEffect(() => {
    const off = usePep.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(usePep.persist.hasHydrated());
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
    const state = usePep.getState();
    if (state.entitlement.source === 'mock' && !purchases.simulated) state.setEntitlement(FREE);
    void initVoice({ storageKey: 'pep-talks-voice-v1' });
    void (async () => {
      try {
        await purchases.configure();
        const unsubscribe = await purchases.subscribe(e => { if (!disposed) usePep.getState().setEntitlement(e); });
        if (disposed) unsubscribe(); else off = unsubscribe;
        const live = await purchases.current();
        if (!disposed) usePep.getState().setEntitlement(live ?? evaluate(usePep.getState().entitlement, new Date().toISOString()));
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
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="moment/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
