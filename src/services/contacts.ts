import firestore from '@react-native-firebase/firestore';
import {User} from '../types/firestoreService';
import {FIREBASE_COLLECTIONS} from '../constants/db_collections';

export const fetchContacts = (
  userId: string,
  callback: (contacts: User[]) => void,
) => {
  const userDocRef = firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId);

  const unsubscribe = userDocRef.onSnapshot(async userDoc => {
    const userData = userDoc.data();
    const contactIds = userData?.contacts || [];

    if (contactIds.length === 0) {
      callback([]);
      return;
    }

    const unsubscribeContacts = firestore()
      .collection(FIREBASE_COLLECTIONS.USERS)
      .where(firestore.FieldPath.documentId(), 'in', contactIds)
      .onSnapshot(snapshot => {
        const contacts = snapshot.docs?.map(doc => {
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

        callback(contacts);
      });

    return unsubscribeContacts;
  });

  return () => unsubscribe();
};

export const addContact = async (userId: string, contactId: string) => {
  try {
    await firestore()
      .collection(FIREBASE_COLLECTIONS.USERS)
      .doc(userId)
      .update({
        contacts: firestore.FieldValue.arrayUnion(contactId),
      });

    await firestore()
      .collection(FIREBASE_COLLECTIONS.USERS)
      .doc(contactId)
      .update({
        contacts: firestore.FieldValue.arrayUnion(userId),
      });
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};
