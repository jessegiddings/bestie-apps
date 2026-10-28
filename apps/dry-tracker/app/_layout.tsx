import { evaluate, FREE, initVoice } from '@bestie/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useHydrated } from '@/state/lifecycle';
import { useBuddySync } from '@/services/buddySync';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerAllClips } from '@/content/clips';
import { purchases } from '@/services/purchases';
import { useDry } from '@/state/store';
import { colors } from '@/ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
registerAllClips();

export default function RootLayout() {
  const hydrated = useHydrated();
  useBuddySync(hydrated);
  const [loaded, fontError] = useFonts({
    PlusJakartaSans_500Medium: require('../assets/fonts/PlusJakartaSans_500Medium.ttf'),
    PlusJakartaSans_700Bold: require('../assets/fonts/PlusJakartaSans_700Bold.ttf'),
    Fraunces_600SemiBold: require('../assets/fonts/Fraunces_600SemiBold.ttf'),
  });

  useEffect(() => {
    if (hydrated && (loaded || fontError)) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, fontError, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (useDry.getState().entitlement.source === 'mock' && !purchases.simulated) useDry.getState().setEntitlement(FREE);
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    void initVoice({ storageKey: 'dry-tracker-voice-v1' });
    const refresh = async () => {
      const st = useDry.getState();
      if (st.entitlement.source === 'mock' && !purchases.simulated) st.setEntitlement(FREE);
      try {
        const live = await purchases.current();
        if (!disposed) st.setEntitlement(live ?? evaluate(useDry.getState().entitlement, new Date().toISOString()));
      } catch { /* Offline: retain a previously validated entitlement only until expiry. */
        if (!disposed) st.setEntitlement(evaluate(useDry.getState().entitlement, new Date().toISOString()));
      }
    };
    void (async () => {
      try {
        await purchases.configure();
        const off = await purchases.subscribe(e => { if (!disposed) useDry.getState().setEntitlement(e); });
        if (disposed) off(); else unsubscribe = off;
        await refresh();
      } catch { /* Missing native SDK must not prevent offline tracking. */ }
    })();
    const app = AppState.addEventListener('change', state => { if (state === 'active') void refresh(); });
    return () => { disposed = true; unsubscribe?.(); app.remove(); };
  }, [hydrated]);

  if (!hydrated || (!loaded && !fontError)) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
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
