import { Platform } from 'react-native';
import { HOST_NAME } from '@/content/brand';

/**
 * One local reminder a day at the chosen morning hour. Nothing is sent from a server and nothing
 * leaves the phone. On web this does nothing.
 */
const REMINDER_ID = 'morning-note';

export async function scheduleMorning(hour: number): Promise<'scheduled' | 'denied' | 'unsupported'> {
  if (Platform.OS === 'web') return 'unsupported';
  const N = await import('expo-notifications');
  const perm = await N.requestPermissionsAsync();
  if (!perm.granted) return 'denied';
  await N.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
  await N.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: { title: `${HOST_NAME} left you a voice note`, body: 'One minute. Press play while the coffee brews.' },
    trigger: { type: N.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 },
  });
  return 'scheduled';
}

export async function cancelMorning(): Promise<void> {
  if (Platform.OS === 'web') return;
  const N = await import('expo-notifications');
  await N.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
}
