import auth from '@react-native-firebase/auth';

export const signUp = async (email: string, password: string, name: string) => {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  await userCredential.user.updateProfile({displayName: name});
  return userCredential;
};

export const login = async (email: string, password: string) => {
  return await auth().signInWithEmailAndPassword(email, password);
};

export const logout = async () => {
  return await auth().signOut();
};

export const observeAuthState = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};
