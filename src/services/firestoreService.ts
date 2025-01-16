import firestore from '@react-native-firebase/firestore';
import {FirestoreChat, FirestoreMessage, User} from '../types/firestoreService';

export const fetchContacts = async (): Promise<User[]> => {
  const snapshot = await firestore().collection('users').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: data.photoURL || null,
      status: data.status || null,
      createdAt: data.createdAt?.toDate() || null,
    };
  }) as User[];
};


export const fetchChats = async (userId: string): Promise<FirestoreChat[]> => {
  console.log('Fetching chats for userId:', userId);

  const snapshot = await firestore()
    .collection('chats')
    .where('members', 'array-contains', userId)
    .get();

  console.log('Fetched chats:', snapshot.docs);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || null,
    };
  }) as FirestoreChat[];
};



export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
): Promise<void> => {
  await firestore().collection('chats').doc(chatId).collection('messages').add({
    senderId,
    text,
    timestamp: firestore.FieldValue.serverTimestamp(),
  });
};


export const listenToMessages = (
  chatId: string,
  callback: (messages: FirestoreMessage[]) => void,
): (() => void) => {
  return firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || null,
        };
      }) as FirestoreMessage[];
      callback(messages);
    });
};
