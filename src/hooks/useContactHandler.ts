import {useNavigation} from '@react-navigation/native';
import {createNewChat} from '../services/firebase';
import {userProfile} from '../types/profile';
import useAuth from '../hooks/useAuth';

const useContactHandler = () => {
  const {user} = useAuth();
  const navigation = useNavigation();

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
        // Navigate to the Chat screen with the correct params
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
        // Navigate to the Chat screen with the correct params
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
