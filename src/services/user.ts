import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {User} from '../types/firestoreService';
import auth from '@react-native-firebase/auth';
import {getUserFromStorage} from './async_storage';
import {FIREBASE_COLLECTIONS} from '../constants/db_collections';

export const fetchUsers = async (userId?: string): Promise<User[]> => {
  let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
    firestore().collection(FIREBASE_COLLECTIONS.USERS);

  if (userId) {
    query = query.where('uid', '!=', userId);
  }
  const snapshot = await query.get();

  return snapshot.docs?.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: data.photoURL || null,
      description: data.description || '',
      status: data.status || null,
    };
  }) as User[];
};

export const listenToUsers = (
  currentUserId: string,
  callback: (users: User[]) => void,
) => {
  return firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .onSnapshot(
      snapshot => {
        const users = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              uid: doc.id,
              displayName: data.displayName || '',
              email: data.email || '',
              photoURL: data.photoURL || null,
              description: data.description || '',
              status: data.status || null,
            };
          })
          ?.filter(user => user.uid !== currentUserId);

        callback(users);
      },
      error => {
        console.error('Error listening to users:', error);
        callback([]);
      },
    );
};

export const createUser = async (uid: string, userData: Partial<User>) => {
  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    ?.doc(uid)
    ?.set(userData, {merge: true});
};

export const fetchUser = async (uid: string) => {
  const userDoc = await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    ?.doc(uid)
    ?.get();
  return userDoc.exists ? userDoc.data() : null;
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
    throw new Error('User is not authenticated');
  }

  await currentUser.updateProfile({
    displayName: name,
  });

  if (email && email !== currentUser.email) {
    await currentUser.updateEmail(email);
  }

  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    ?.doc(currentUser.uid)
    ?.update({
      displayName: name,
      email: email,
    });
};

export const getCurrentUserProfile = async () => {
  try {
    const user = await getUserFromStorage();
    if (!user) {
      console.error('No user profile found in storage.');
    }
    return user;
  } catch (error) {
    console.error('Failed to get user profile from storage:', error);
    throw error;
  }
};
