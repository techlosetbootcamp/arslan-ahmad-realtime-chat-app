import firestore from '@react-native-firebase/firestore';
import {Chat, Message} from '../types/firestoreService';
import {User} from '../types/firestoreService';
import { setLoading } from '../store/slices/chatSlice';

/*
  TODO: Implement the following functions on 'User.contacts', Now it is only implemented on 'User'
*/
export const fetchUsers = async (): Promise<User[]> => {
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
    };
  }) as User[];
};

// Create or update a user
export const createUser = async (uid: string, userData: Partial<User>) => {
  await firestore().collection('users').doc(uid).set(userData, {merge: true});
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

  const chats = snapshot.docs.map(doc => {
    const chatData = doc.data();

    const lastActive = chatData.lastActive ? chatData.lastActive.toDate().toISOString() : null;
    const participants = chatData.participants || [];
    const lastMessage = chatData.lastMessage || ''; 
    const unreadMessages = chatData.unreadMessages || 0; 
    const notificationStatus = chatData.notificationStatus ?? true;

    // Initialize participantsDetails to an empty array
    let participantsDetails: any[] = [];

    // Ensure participantsDetails is populated with full participant data
    if (chatData.participantsDetails) {
      participantsDetails = chatData.participantsDetails.map((participant: any) => ({
        ...participant,
        createdAt: participant.createdAt ? participant.createdAt.toDate().toISOString() : null,
      }));
    }

    return {
      id: doc.id,
      participants,
      lastMessage,
      unreadMessages,
      notificationStatus,
      lastActive,
      participantsDetails, // Attach the full details of participants
    };
  });
  

  // Fetch user details for all participants
  const userPromises = chats.map(async chat => {
    const userDetails = await Promise.all(
      chat.participants.map(async (participantId: string) => {
        // Fetch user data by their ID
        const user = await fetchUser(participantId);
        return { uid: participantId, ...user };
      })
    );
    return { ...chat, participantsDetails: userDetails };
  });

  // Wait for all the user promises to resolve and return the chats
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
  await firestore().collection('users').doc(userId).update({
    contacts: firestore.FieldValue.arrayUnion(contactId),
  });

  await firestore().collection('users').doc(contactId).update({
    contacts: firestore.FieldValue.arrayUnion(userId),
  });
};



export const createNewChat = async (
  participants: string[],
): Promise<string> => {
  const chatRef = firestore().collection('chats').doc();
  const chatId = chatRef.id;

  await chatRef.set({
    participants,
    lastMessage: '',
    lastActive: firestore.FieldValue.serverTimestamp(),
    unreadMessages: 0,
    notificationStatus: 'allowed',
    messages: [],
  });

  const usersRef = firestore().collection('users');
  await Promise.all(
    participants.map(uid =>
      usersRef.doc(uid).update({
        chats: firestore.FieldValue.arrayUnion(chatId),
      }),
    ),
  );

  return chatId;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  const messageRef = firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .doc();

  await messageRef.set({
    id: messageRef.id,
    senderId,
    text,
    contentType: 'text',
    timestamp: firestore.FieldValue.serverTimestamp(),
    status: {sender: 'sent', receiver: 'unread'},
  });

  await firestore().collection('chats').doc(chatId).update({
    lastMessage: text,
    lastActive: firestore.FieldValue.serverTimestamp(),
  });
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

// Listen to real-time messages
export const listenToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void,
) => {
  return firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate().toISOString(),
        ...doc.data(),
      })) as Message[];
      callback(messages);
    });
};
