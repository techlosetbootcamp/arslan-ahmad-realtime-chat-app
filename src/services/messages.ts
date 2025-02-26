import firestore from '@react-native-firebase/firestore';
import {Message} from '../types/firestoreService';
import {FIREBASE_COLLECTIONS} from '../constants/db_collections';

export const sendMessage = async (
  receiverId: string,
  senderId: string,
  message: Message,
) => {
  const chatId =
    senderId < receiverId ? senderId + receiverId : receiverId + senderId;

  const chatRef = firestore()
    .collection(FIREBASE_COLLECTIONS.CHATS)
    ?.doc(chatId);
  const messageRef = chatRef
    .collection(FIREBASE_COLLECTIONS.MESSAGES)
    ?.doc(message.id);

  try {
    await messageRef.set({
      ...message,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    await chatRef.set(
      {
        lastMessage: message.text,
        lastActive: firestore.FieldValue.serverTimestamp(),
        unreadCount: firestore.FieldValue.increment(1),
      },
      {merge: true},
    );

    await chatRef.update({
      [`unreadCount.${receiverId}`]: firestore.FieldValue.increment(1),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const snapshot = await firestore()
    .collection(FIREBASE_COLLECTIONS.CHATS)
    ?.doc(chatId)
    .collection(FIREBASE_COLLECTIONS.MESSAGES)
    ?.orderBy('timestamp', 'asc')
    ?.get();

  return snapshot.docs?.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp:
        data?.timestamp instanceof firestore.Timestamp
          ? data.timestamp.toDate().toISOString()
          : data?.timestamp || null,
    };
  }) as Message[];
};

export const listenToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void,
) => {
  return firestore()
    ?.collection(FIREBASE_COLLECTIONS.CHATS)
    ?.doc(chatId)
    ?.collection(FIREBASE_COLLECTIONS.MESSAGES)
    ?.orderBy('timestamp', 'asc')
    ?.onSnapshot(
      snapshot => {
        const messages = snapshot.docs?.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp:
              data?.timestamp instanceof firestore.Timestamp
                ? data.timestamp.toDate().toISOString()
                : data?.timestamp || null,
          };
        }) as Message[];
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
    ?.collection(FIREBASE_COLLECTIONS.CHATS)
    ?.doc(chatId)
    ?.collection(FIREBASE_COLLECTIONS.MESSAGES)
    ?.doc(messageId);

  await messageRef.delete();
};
