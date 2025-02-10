import { ToastAndroid } from 'react-native';
import {FirebaseError} from '@firebase/util';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_CLIENT_ID} from '@env';
import {User} from '../types/firestoreService';
import {showToast} from '../components/Toast';

const getUserDataFromFirestore = async (uid: string): Promise<User | null> => {
  const userDoc = await firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) {
    throw new Error('User document not found in Firestore.');
  }
  const userData = userDoc.data();
  return {
    uid,
    displayName: userData?.displayName || '',
    email: userData?.email || '',
    photoURL: userData?.photoURL || null,
    status: userData?.status || null,
    chats: userData?.chats || [],
    contacts: userData?.contacts || [],
  } as User;
};

export const observeAuthState = (
  callback: (user: User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await getUserDataFromFirestore(firebaseUser.uid);
        if (!user) {
          console.warn(`No Firestore document found for user: ${firebaseUser.uid}`);
          callback(null);
          return;
        }
        callback(user);
      } catch (error) {
        console.error('Error mapping Firebase user to custom User:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};


export const login = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential | null> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    await getUserDataFromFirestore(userCredential.user.uid);
    showToast('Success', 'Logged in successfully... 🌟', 'success');
    return userCredential;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
};

export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<FirebaseAuthTypes.UserCredential | null> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    await userCredential.user.updateProfile({displayName: name});

    const userDoc: User = {
      uid: userCredential.user.uid,
      displayName: name,
      email,
      status: null,
      photoURL: null,
      chats: [],
      contacts: [],
    };

    if (userDoc.uid) {
      await firestore().collection('users').doc(userDoc.uid).set(userDoc);
    } else {
      throw new Error('User UID is null.');
    }
    showToast('Success', 'Account created successfully... 🤠', 'success');
    return userCredential;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
};
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    await GoogleSignin.signOut();

    const signInResponse = await GoogleSignin.signIn();
    const { data } = signInResponse;

    if (!data?.idToken) {
      throw new Error('Google Sign-In failed: idToken is null.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    const response = await auth().signInWithCredential(googleCredential);
    const { uid, email, displayName, photoURL } = response?.user;
    showToast('Success', 'Logged in successfully... 🌟', 'success');
    return { uid, email, displayName, photoURL };
  } catch (err) {
    const error = err as FirebaseError;
    ToastAndroid.show('Google login failed. Please try again.', ToastAndroid.LONG);
    throw error.message || 'An unknown error occurred';
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    const providers = auth().currentUser?.providerData?.map(
      provider => provider.providerId,
    );
    if (providers?.includes('google.com')) {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
    showToast('Success', 'Logged out successfully... 🙂', 'success');
  } catch (error) {
    console.error('Failed to log out:', error);
    showToast('Not logged-out', 'Failed to log out', 'error');
  }
};

const handleAuthError = (error: any) => {
  if (error instanceof FirebaseError) {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/user-not-found':
        showToast('Login Failed', 'No user found with this email.', 'error');
        break;
      case 'auth/wrong-password':
        showToast(
          'Login Failed',
          'Incorrect password. Please try again.',
          'error',
        );
        break;
      case 'auth/invalid-email':
        showToast('Login Failed', 'Invalid email address format.', 'error');
        break;
      case 'auth/email-already-in-use':
        showToast('Sign-Up Failed', 'Email is already in use.', 'error');
        break;
      case 'auth/weak-password':
        showToast(
          'Sign-Up Failed',
          'Password is too weak. Please use a stronger password.',
          'error',
        );
        break;
      default:
        showToast('Failed to Authenticate', 'An unexpected error occurred.', 'error');
    }
  }
};
