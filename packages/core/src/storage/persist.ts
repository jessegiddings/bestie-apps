import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Device storage for zustand `persist`, shared so every app saves the same way. */
export const deviceStorage = createJSONStorage(() => AsyncStorage);
