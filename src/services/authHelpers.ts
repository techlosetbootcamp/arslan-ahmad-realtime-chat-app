import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/firestoreService";

const USER_STORAGE_KEY = "USER_SESSION";

export const saveUserToStorage = async (user: User) => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUserFromStorage = async (): Promise<User | null> => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUserFromStorage = async () => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
};
