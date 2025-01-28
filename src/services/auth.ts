import {FirebaseError} from '@firebase/util';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  removeUserFromStorage,
  saveUserToStorage,
} from './async_storage';
import {User} from '../types/firestoreService';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';

export const observeAuthState = (
  callback: (user: User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(async firebaseUser => {
    if (firebaseUser) {
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser?.uid)
          .get();
        if (!userDoc.exists) {
          throw new Error('User document not found in Firestore.');
        }
        const userData = userDoc.data();

        const user: User = {
          uid: firebaseUser.uid,
          displayName: userData?.displayName || '',
          email: firebaseUser.email || '',
          photoURL: userData?.photoURL || null,
          status: userData?.status || null,
        };

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
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get();

      if (!userDoc.exists) {
        throw new Error('User document not found in Firestore.');
      }

      const userData = userDoc.data();

      const user: User = {
        uid: firebaseUser.uid,
        displayName: userData?.displayName || '',
        email: firebaseUser.email || '',
        photoURL: userData?.photoURL || null,
        status: userData?.status || null,
      };

      console.log(
        'User logged in:',
        user.displayName + ' (' + user.email + ')',
      );

      await saveUserToStorage(user);
    }

    return userCredential;
  } catch (error) {
    if (
      error instanceof Error &&
      (error as FirebaseAuthTypes.NativeFirebaseAuthError).code
    ) {
      const errorCode = (error as FirebaseAuthTypes.NativeFirebaseAuthError)
        .code;
      switch (errorCode) {
        case 'auth/user-not-found':
          Alert.alert('Login Failed', 'No user found with this email.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Login Failed', 'Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Login Failed', 'Invalid email address format.');
          break;
        case 'auth/invalid-credential':
          Alert.alert('Login Failed', 'User not found... Please sign up.');
          break;
        default:
          Alert.alert('Login Failed', 'Please recheck inputs...');
      }
    }
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

    if (userCredential.user) {
      await userCredential.user.updateProfile({displayName: name});
    }

    const userId = userCredential.user.uid;
    const userDoc: User = {
      uid: userId,
      displayName: name,
      email,
      status: null,
      photoURL: null,
      chats: [],
      contacts: [],
    };

    await firestore().collection('users').doc(userId).set(userDoc);

    console.log('User saved in Database...');
    await saveUserToStorage(userDoc);
    return userCredential;
  } catch (error) {
    console.error('Sign-up failed:', error);
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          Alert.alert('Sign-Up Failed', 'Email is already in use.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Sign-Up Failed', 'Invalid email address format.');
          break;
        case 'auth/weak-password':
          Alert.alert(
            'Sign-Up Failed',
            'Password is too weak. Please use a stronger password.',
          );
          break;
        default:
          Alert.alert('Sign-Up Failed', 'An unexpected error occurred.');
      }
    }
    return null;
  }
};

export const signInWithGoogle = async () => {
  try {
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID token found.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);

    const {uid, email, displayName, photoURL} = userCredential.user;

    await firestore().collection('users').doc(uid).set(
      {
        uid,
        email,
        displayName,
        photoURL,
        lastLogin: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    console.log('User signed in and saved successfully:', {
      uid,
      email,
      displayName,
      photoURL,
    });
    const userDoc: User = {
      uid,
      displayName,
      email,
      status: null,
      photoURL,
      chats: [],
      contacts: [],
    };

    await saveUserToStorage(userDoc);
    return userCredential.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error('Error during Google Sign-In:', error.message);
      throw error;
    }
  }
};

export const logoutUser = async () => {
  try {
    const providers = auth().currentUser?.providerData.map(
      provider => provider.providerId,
    );
    if (providers?.includes('google.com')) {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
    await removeUserFromStorage();
  } catch (error) {
    console.error('Failed to log out:', error);
    Alert.alert('Error', 'Failed to log out');
  } finally {
  }
};
