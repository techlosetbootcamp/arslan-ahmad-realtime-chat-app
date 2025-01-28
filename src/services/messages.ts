import firestore, {FieldPath} from '@react-native-firebase/firestore';
import {Message} from '../types/firestoreService';

export const sendMessage = async (
  receiverId: string,
  senderId: string,
  text: string,
) => {
  const chatId =
    senderId < receiverId ? senderId + receiverId : receiverId + senderId;

  const chatRef = firestore().collection('chats').doc(chatId);
  const messageRef = chatRef.collection('messages').doc();

  try {
    await messageRef.set({
      id: messageRef.id,
      senderId,
      text,
      contentType: 'text',
      timestamp: firestore.FieldValue.serverTimestamp(),
      status: {sender: 'sent', receiver: 'unread'},
    });

    await chatRef.set(
      {
        lastMessage: text,
        lastActive: firestore.FieldValue.serverTimestamp(),
        unreadCount: firestore.FieldValue.increment(1),
      },
      {merge: true},
    );

    await chatRef.update(
      new FieldPath('unreadCount', receiverId),
      firestore.FieldValue.increment(1),
    );
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const snapshot = await firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate().toISOString(),
  })) as Message[];
};

export const listenToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void,
) => {
  return firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(
      snapshot => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString(),
        })) as Message[];
        callback(messages);
      },
      error => {
        console.error('Error listening to messages:', error);
        callback([]);
      },
    );
};

export const deleteMessage = async (
  chatId: string,
  messageId: string,
): Promise<void> => {
  const messageRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .doc(messageId);

  await messageRef.delete();
};
