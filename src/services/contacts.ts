import firestore from '@react-native-firebase/firestore';
import {User} from '../types/firestoreService';

export const fetchContacts = (
  userId: string,
  callback: (contacts: User[]) => void,
) => {
  const userDocRef = firestore().collection('users').doc(userId);

  const unsubscribe = userDocRef.onSnapshot(
    async userDoc => {
      const userData = userDoc.data();
      const contactIds = userData?.contacts || [];

      if (contactIds.length === 0) {
        callback([]);
        return;
      }

      const contactsSnapshot = await firestore()
        .collection('users')
        .where(firestore.FieldPath.documentId(), 'in', contactIds)
        .get();

      const contacts = contactsSnapshot.docs.map(doc => {
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
    },
    error => {
      console.error('Error fetching contacts:', error);
      callback([]);
    },
  );

  return unsubscribe;
};

export const addContact = async (userId: string, contactId: string) => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        contacts: firestore.FieldValue.arrayUnion(contactId),
      });

    await firestore()
      .collection('users')
      .doc(contactId)
      .update({
        contacts: firestore.FieldValue.arrayUnion(userId),
      });
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};
