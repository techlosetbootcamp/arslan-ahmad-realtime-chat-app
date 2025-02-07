import {FirebaseError} from '@firebase/util';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {removeUserFromStorage, saveUserToStorage} from './async_storage';
import {User} from '../types/firestoreService';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {UserState} from '../store/slices/user.slice';
import {showToast} from '../components/Toast';

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

      const userDataFromFirestore = userDoc.data();

      const userData: User = {
        uid: firebaseUser.uid,
        displayName:
          firebaseUser.displayName || userDataFromFirestore?.displayName || '',
        email: firebaseUser.email || '',
        photoURL:
          firebaseUser.photoURL || userDataFromFirestore?.photoURL || null,
        status: userDataFromFirestore?.status || null,
        chats: userDataFromFirestore?.chats || [],
        contacts: userDataFromFirestore?.contacts || [],
      };

      await saveUserToStorage(userData);
    }
    showToast('Success', 'Logged in successfully... 🌟', 'success');
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
        case 'auth/invalid-credential':
          showToast(
            'Login Failed',
            'User not found... Please sign up.',
            'error',
          );
          break;
        default:
          showToast('Login Failed', 'Please recheck inputs...', 'error');
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

    await saveUserToStorage(userDoc);
    showToast('Success', 'Account created successfully... 🤠', 'success');
    return userCredential;
  } catch (error) {
    console.error('Sign-up failed:', error);
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          showToast('Sign-Up Failed', 'Email is already in use.', 'error');
          break;
        case 'auth/invalid-email':
          showToast('Sign-Up Failed', 'Invalid email address format.', 'error');
          break;
        case 'auth/weak-password':
          showToast(
            'Sign-Up Failed',
            'Password is too weak. Please use a stronger password.',
            'error',
          );
          break;
        default:
          showToast('Sign-Up Failed', 'An unexpected error occurred.', 'error');
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

    const userDocRef = firestore().collection('users').doc(uid);
    const userDocSnapshot = await userDocRef.get();

    let userData: User;

    if (userDocSnapshot.exists) {
      const firestoreData = userDocSnapshot.data();
      userData = {
        uid,
        email: email || firestoreData?.email || null,
        displayName: displayName || firestoreData?.displayName || null,
        photoURL: photoURL || firestoreData?.photoURL || null,
        status: firestoreData?.status || null,
        chats: firestoreData?.chats || [],
        contacts: firestoreData?.contacts || [],
      };
    } else {
      userData = {
        uid,
        email,
        displayName,
        photoURL,
        status: null,
        chats: [],
        contacts: [],
      };

      await userDocRef.set({
        uid,
        email,
        displayName,
        photoURL,
        lastLogin: firestore.FieldValue.serverTimestamp(),
      });
    }
    await saveUserToStorage(userData);
    showToast('Success', 'Logged in successfully... 😎', 'success');
    return userCredential.user as Partial<UserState> & {uid: string};
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error('Error during Google Sign-In:', error.message);
      throw error;
    } else {
      console.error('Error during Google Sign-In:', error);
      throw error;
    }
  }
};

export const logoutUser = async () => {
  try {
    const providers = auth().currentUser?.providerData?.map(
      provider => provider.providerId,
    );
    if (providers?.includes('google.com')) {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
    await removeUserFromStorage();
    showToast('Success', 'Logged out successfully... 🙂', 'success');
  } catch (error) {
    console.error('Failed to log out:', error);
    showToast('Error', 'Failed to log out', 'error');
  } finally {
  }
};
