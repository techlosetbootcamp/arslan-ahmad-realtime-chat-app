import firestore from '@react-native-firebase/firestore';
import { Chat, Message } from '../store/slices/chatSlice';
import { User } from '../types/firestoreService';


/*
  TODO: Implement the following functions on 'User.contacts', Now it is only implemented on 'User'
*/
export const fetchContacts = async (): Promise<User[]> => {
  const snapshot = await firestore().collection('users').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      displayName: data.displayName || '',
      email: data.email || '',
      photoURL: data.photoURL || null,
      description: data.description || '',
      status: data.status || null,
      createdAt: data.createdAt?.toDate() || null,
    };
  }) as User[];
};

// Create or update a user
export const createUser = async (uid: string, userData: Partial<User>) => {
  await firestore().collection('users').doc(uid).set(userData, { merge: true });
};

// Fetch user by ID
export const fetchUser = async (uid: string) => {
  const userDoc = await firestore().collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
};

// Fetch chats for a user
export const fetchChats = async (userId: string): Promise<Chat[]> => {
  const snapshot = await firestore()
    .collection('chats')
    .where('participants', 'array-contains', userId)
    .get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Chat[];
};

// Create a new chat
export const createChat = async (chatId: string, participants: string[]) => {
  await firestore()
    .collection('chats')
    .doc(chatId)
    .set({
      participants,
      lastMessage: '',
      lastActive: firestore.FieldValue.serverTimestamp(),
      unreadMessages: 0,
      notificationStatus: 'allowed',
    });
};

// Send a message
export const sendMessage = async (chatId: string, senderId: string, text: string) => {
  await firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .add({
      senderId,
      text,
      contentType: 'text',
      timestamp: firestore.FieldValue.serverTimestamp(),
      status: { sender: 'sent', receiver: 'unread' },
    });

  // Update chat metadata
  await firestore().collection('chats').doc(chatId).update({
    lastMessage: text,
    lastActive: firestore.FieldValue.serverTimestamp(),
  });
};

// Fetch messages for a chat
export const fetchMessages = async (chatId: string) => {
  const snapshot = await firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Listen to real-time messages
export const listenToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  return firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      callback(messages);
    });
};
