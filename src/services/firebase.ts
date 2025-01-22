import firestore, {FieldPath, FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Chat, Message} from '../types/firestoreService';
import {User} from '../types/firestoreService';

export const fetchUsers = async (userId?: string): Promise<User[]> => {
  let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection('users');

  if (userId) {
    query = query.where('uid', '!=', userId);
  }

  const snapshot = await query.get();

  return snapshot.docs.map(doc => {
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


export const createUser = async (uid: string, userData: Partial<User>) => {
  await firestore().collection('users').doc(uid).set(userData, {merge: true});
};

export const fetchUser = async (uid: string) => {
  const userDoc = await firestore().collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
};

export const fetchChats = async (userId: string): Promise<Chat[]> => {
  const snapshot = await firestore()
    .collection('chats')
    .where('participants', 'array-contains', userId)
    .get();

  const chats = snapshot.docs.map(doc => {
    const chatData = doc.data();

    const lastActive = chatData.lastActive
      ? chatData.lastActive.toDate().toISOString()
      : null;
    const participants = chatData.participants || [];
    const lastMessage = chatData.lastMessage || '';
    const unreadMessages = chatData.unreadMessages || 0;
    const notificationStatus = chatData.notificationStatus ?? true;

    let participantsDetails: any[] = [];

    if (chatData.participantsDetails) {
      participantsDetails = chatData.participantsDetails.map(
        (participant: any) => ({
          ...participant,
          createdAt: participant.createdAt
            ? participant.createdAt.toDate().toISOString()
            : null,
        }),
      );
    }

    return {
      id: doc.id,
      participants,
      lastMessage,
      unreadMessages,
      notificationStatus,
      lastActive,
      participantsDetails,
    };
  });

  const userPromises = chats.map(async chat => {
    const userDetails = await Promise.all(
      chat.participants.map(async (participantId: string) => {
        const user = await fetchUser(participantId);
        return {uid: participantId, ...user};
      }),
    );
    return {...chat, participantsDetails: userDetails};
  });

  return Promise.all(userPromises);
};

export const fetchContacts = async (userId: string): Promise<User[]> => {
  const userDoc = await firestore().collection('users').doc(userId).get();
  const userData = userDoc.data();
  const contactIds = userData?.contacts || [];

  const contactsSnapshot = await firestore()
    .collection('users')
    .where(firestore.FieldPath.documentId(), 'in', contactIds)
    .get();

  return contactsSnapshot.docs.map(doc => {
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

export const addContact = async (userId: string, contactId: string) => {
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
};

export const createNewChat = async (
  participants: string[],
): Promise<string> => {
  const [user1, user2] = participants.sort();
  const chatId = user1 + user2;

  const chatRef = firestore().collection('chats').doc(chatId);
  const usersRef = firestore().collection('users');

  try {
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      await chatRef.set({
        participants,
        lastMessage: '',
        lastActive: firestore.FieldValue.serverTimestamp(),
        notificationStatus: 'allowed',
        unreadCount: {[user1]: 0, [user2]: 0},
      });

      await Promise.all(
        participants.map(uid =>
          usersRef.doc(uid).update({
            chats: firestore.FieldValue.arrayUnion(chatId),
          }),
        ),
      );
    }

    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

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
