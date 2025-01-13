import firestore from '@react-native-firebase/firestore';
import {FirestoreChat, FirestoreMessage, User} from '../types/firestoreService';

export const fetchContacts = async (): Promise<User[]> => {
  const snapshot = await firestore().collection('users').get();
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  })) as User[];
};

export const fetchChats = async (userId: string): Promise<FirestoreChat[]> => {
  console.log('Fetching chats for userId:', userId);

  const snapshot = await firestore()
    .collection('chats')
    .where('members', 'array-contains', userId)
    .get();

  console.log('Fetched chats:', snapshot.docs);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as FirestoreChat[];
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
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreMessage[];
      callback(messages);
    });
};
