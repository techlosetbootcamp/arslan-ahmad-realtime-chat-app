import firestore from '@react-native-firebase/firestore';
import {fetchUser} from './user';
import {Chat, User} from '../types/firestoreService';

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

export const fetchChats = (
  userId: string,
  callback: (chats: Chat[]) => void,
) => {
  const unsubscribe = firestore()
    .collection('chats')
    .where('participants', 'array-contains', userId)
    .orderBy('lastActive', 'desc')
    .onSnapshot(
      async snapshot => {
        const chats = snapshot.docs.map(doc => {
          const chatData = doc.data();

          const lastActive = chatData.lastActive
            ? chatData.lastActive.toDate().toISOString()
            : null;
          const participants = chatData.participants || [];
          const lastMessage = chatData.lastMessage || '';
          const unreadMessages = chatData.unreadMessages || 0;
          const notificationStatus = chatData.notificationStatus ?? true;

          let participantsDetails: User[] = [];

          if (chatData.participantsDetails) {
            participantsDetails = chatData.participantsDetails.map(
              (participant: Partial<User>) => ({
                ...participant,
                createdAt:
                  'createdAt' in participant &&
                  participant.createdAt instanceof firestore.Timestamp
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

        const resolvedChats = await Promise.all(userPromises);
        callback(resolvedChats);
      },
      error => {
        console.error('Error fetching chats:', error);
        callback([]);
      },
    );

  return unsubscribe;
};

export const deleteChat = async (chatId: string, participants: string[]) => {
  const chatRef = firestore().collection('chats').doc(chatId);
  const usersRef = firestore().collection('users');

  try {
    await chatRef.delete();

    await Promise.all(
      participants.map(uid =>
        usersRef.doc(uid).update({
          chats: firestore.FieldValue.arrayRemove(chatId),
        }),
      ),
    );

    console.log(`Chat ${chatId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};
