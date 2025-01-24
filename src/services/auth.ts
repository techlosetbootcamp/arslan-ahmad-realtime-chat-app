import {FirebaseError} from '@firebase/util';
import auth, {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import {
  getUserFromStorage,
  removeUserFromStorage,
  saveUserToStorage,
} from './authHelpers';
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
): Promise<FirebaseAuthTypes.UserCredential> => {
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
    console.error('Login failed:', error);
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
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
  } catch (error: any) {
    console.error('Sign-up failed:', error.message);
    throw new Error(error.message || 'Sign-up failed');
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

export const updateUserProfile = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const currentUser = auth().currentUser;

  if (!currentUser) throw new Error('User is not authenticated');

  await currentUser.updateProfile({
    displayName: name,
  });

  if (email && email !== currentUser.email) {
    await currentUser.updateEmail(email);
  }

  await firestore().collection('users').doc(currentUser.uid).update({
    displayName: name,
    email: email,
  });
};

export const uploadProfileImage = async (imageUri: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('No user is logged in');

  const storage = getStorage();
  const imageName = user.uid + '_profile_image';
  const imageRef = ref(storage, 'profile_images/' + imageName);

  const response = await fetch(imageUri);
  const blob = await response.blob();

  const uploadTask = uploadBytesResumable(imageRef, blob);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      error => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve(downloadURL);
        });
      },
    );
  });
};

export const getCurrentUserProfile = async () => {
  try {
    const user = await getUserFromStorage();
    if (!user) {
      console.log('No user profile found in storage.');
    }
    return user;
  } catch (error) {
    console.error('Failed to get user profile from storage:', error);
    throw error;
  }
};
