import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {getAuth, updateProfile} from 'firebase/auth';
import {
  GoogleSignin,
  SignInResponse,
  SignInSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {SignInResult} from '../types/auth';
import {AppDispatch} from '../store/store';
import {setUser} from '../store/slices/userSlice';

export const observeAuthState = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

export const login = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  return await auth().signInWithEmailAndPassword(email, password);
};

export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );

  if (userCredential.user) {
    await userCredential.user.updateProfile({displayName: name});
  }

  return userCredential;
};

export const logoutUser = async (): Promise<void> => {
  return await auth().signOut();
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

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const signInResult: SignInResponse = await GoogleSignin.signIn();

    console.log('signInResult:', signInResult.data?.user);

    if (signInResult.data?.idToken) {
      const idToken = signInResult.data?.idToken;

      // Use the token with Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } else {
      throw new Error('Google Sign-In failed to retrieve idToken');
    }
  } catch (error) {
    console.error('Google Sign-In Error: ', error);
    throw new Error('Google Sign-In failed');
  }
};
