import { Platform } from 'react-native';
import { HOST_NAME } from '@/content/brand';

/**
 * One local reminder a day at the chosen check-in hour. Nothing is sent from a server and nothing
 * leaves the phone. On web this does nothing.
 */
const REMINDER_ID = 'evening-checkin';

export async function scheduleCheckIn(hour: number): Promise<'scheduled' | 'denied' | 'unsupported'> {
  if (Platform.OS === 'web') return 'unsupported';
  const N = await import('expo-notifications');
  const perm = await N.requestPermissionsAsync();
  if (!perm.granted) return 'denied';
  await N.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
  await N.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: { title: `Your check-in from ${HOST_NAME} is ready`, body: 'Thirty seconds, then tell me how today went.' },
    trigger: { type: N.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 },
  });
  return 'scheduled';
}

export async function cancelCheckIn(): Promise<void> {
  if (Platform.OS === 'web') return;
  const N = await import('expo-notifications');
  await N.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
}
