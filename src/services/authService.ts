import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
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
import { clearUser } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';

export const observeAuthState = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(callback);
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
    const user = userCredential.user;

    if (user) {
      console.log('Logged-in user:', user);
      await saveUserToStorage(user as User);
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
      await userCredential.user.updateProfile({displayName: name}); // Update user's display name
    }

    return userCredential;
  } catch (error: any) {
    console.error('Sign-up failed:', error.message);
    throw new Error(error.message || 'Sign-up failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  const dispatch = useDispatch();
  try {
    await auth().signOut();
    await removeUserFromStorage();
    dispatch(clearUser());
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
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
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  await currentUser.updateProfile({
    displayName: name,
  });

  if (email !== currentUser.email) {
    await currentUser.updateEmail(email);
  }

  await currentUser.reload();

  console.log('User profile updated in Firebase');
};

export const uploadProfileImage = async (imageUri: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('No user is logged in');

  const storage = getStorage();
  const imageName = user.uid + '_profile_image'; // Create a unique file name for the user's image
  const imageRef = ref(storage, 'profile_images/' + imageName);

  const response = await fetch(imageUri);
  const blob = await response.blob();

  const uploadTask = uploadBytesResumable(imageRef, blob);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      error => reject(error), // Handle upload errors
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve(downloadURL); // Return the URL of the uploaded image
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
