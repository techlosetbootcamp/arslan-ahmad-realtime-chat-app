import {createNewChat} from '../services/user';
import {userProfile} from '../types/profile';
import useAuth from './useAuth';
import appNavigate from './useNavigation';

const useContactHandler = () => {
  const {navigation} = appNavigate();
const {user} = useAuth();

  const handleContactClick = async (
    contactId: string,
    participant: userProfile,
  ) => {
    if (!user?.uid) return;

    try {
      const userChats = user.chats;

      const existingChat = userChats?.find(chatId =>
        chatId.includes(contactId),
      );

      if (existingChat) {
        navigation.navigate('Chat', {
          chatId: existingChat,
          participant: {
            uid: participant.uid,
            displayName: participant.displayName,
            photoURL: participant.photoURL || null,
            status: participant.status || 'Offline',
          },
        });
      } else {
        const chatId = await createNewChat([user.uid, contactId]);
        navigation.navigate('Chat', {
          chatId,
          participant: {
            uid: participant.uid,
            displayName: participant.displayName,
            photoURL: participant.photoURL || null,
            status: participant.status || 'Offline',
          },
        });
      }
    } catch (error) {
      console.error('Error starting or navigating to chat:', error);
    }
  };

  return {handleContactClick};
};

export default useContactHandler;
