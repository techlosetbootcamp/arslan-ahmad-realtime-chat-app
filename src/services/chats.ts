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
        lastActive: Date.now(),
        notificationStatus: 'allowed',
        unreadCount: {[user1]: 0, [user2]: 0},
      });

      await Promise.all(
        participants?.map(uid =>
          usersRef.doc(uid)?.update({
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
        const chats = snapshot.docs?.map(doc => {
          const chatData = doc.data();

          const lastActive =
            chatData.lastActive instanceof firestore.Timestamp
              ? chatData.lastActive.toDate().toISOString()
              : null;

          const participants = chatData.participants || [];
          const lastMessage = chatData.lastMessage || '';
          const unreadMessages = chatData.unreadMessages || 0;
          const notificationStatus = chatData.notificationStatus ?? true;

          let participantsDetails: User[] = [];

          if (Array.isArray(chatData.participantsDetails)) {
            participantsDetails = chatData.participantsDetails.map(
              (participant: Partial<User>) => {
                if (!participant) {
                  return {} as User;
                }
                return {
                  uid: participant.uid || '',
                  displayName: participant.displayName || '',
                  email: participant.email || '',
                  status: participant.status || '',
                  createdAt:
                    'createdAt' in participant &&
                    participant.createdAt instanceof firestore.Timestamp
                      ? participant.createdAt.toDate().toISOString()
                      : null,
                };
              },
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

        if (!chats || chats.length === 0) {
          callback([]);
          return;
        }

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

export const listenToChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  return firestore()
    .collection('chats')
    .where('participants', 'array-contains', userId)
    .orderBy('lastActive', 'desc')
    .onSnapshot(
      async snapshot => {
        const chats = await Promise.all(snapshot.docs.map(async doc => {
          const chatData = doc.data();
          const participantsDetails = await Promise.all(
            (chatData.participants || []).map(async (participantId: string) => {
              const user = await fetchUser(participantId);
              return { uid: participantId, ...user };
            })
          );
          return {
            id: doc.id,
            participants: chatData.participants || [],
            lastMessage: chatData.lastMessage || '',
            unreadMessages: chatData.unreadCount?.[userId] || 0,
            notificationStatus: chatData.notificationStatus ?? true,
            lastActive: chatData.lastActive?.toDate().toISOString() || null,
            participantsDetails,
          };
        }));

        callback(chats);
      },
      error => {
        console.error('Error listening to chats:', error);
        callback([]);
      }
    );
};


export const deleteChat = async (chatId: string, participants: string[]) => {
  const chatRef = firestore().collection('chats').doc(chatId);
  const usersRef = firestore().collection('users');

  try {
    const messagesRef = chatRef.collection('messages');
    messagesRef.get().then(querySnapshot => {
      Promise.all(querySnapshot.docs.map(d => d.ref.delete()));
    });

    await chatRef.delete();

    await Promise.all(
      participants?.map(uid =>
        usersRef.doc(uid).update({
          chats: firestore.FieldValue.arrayRemove(chatId),
        }),
      ),
    );
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};
