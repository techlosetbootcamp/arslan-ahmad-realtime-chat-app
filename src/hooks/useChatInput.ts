import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';

const useChat = () => {
  const handleCamera = async (chatId: string, senderId: string) => {
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (response.didCancel) {
        console.log('User canceled camera');
        return;
      }

      if (response.errorCode) {
        console.error('Camera Error:', response.errorMessage);
        return;
      }

      const base64Image = response.assets?.[0]?.base64;
      if (base64Image) {
        await sendImageMessage(chatId, senderId, base64Image);
      }
    } catch (error) {
      console.error('Error handling camera:', error);
    }
  };

  const handleSelectImages = async (chatId: string, senderId: string) => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (response.didCancel) {
        console.log('User canceled image picker');
        return;
      }

      if (response.errorCode) {
        console.error('Image Picker Error:', response.errorMessage);
        return;
      }

      const base64Image = response.assets?.[0]?.base64;
      if (base64Image) {
        await sendImageMessage(chatId, senderId, base64Image);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const sendImageMessage = async (
    recvId: string,
    senderId: string,
    imageBase64: string,
  ) => {
    const chatId = senderId < recvId ? senderId + recvId : recvId + senderId;

    const chatRef = firestore().collection('chats').doc(chatId);
    const messageRef = chatRef.collection('messages').doc();
    try {
      const messageData = {
        id: messageRef.id,
        senderId,
        text: imageBase64,
        imageUrl: imageBase64
          ? `data:image/jpeg;base64,${imageBase64}`
          : undefined,
        contentType: imageBase64 ? 'image' : 'text',
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: {sender: 'sent', receiver: 'unread'},
      };

      await messageRef.set(messageData);

      // Update chat metadata
      await chatRef.set(
        {
          lastMessage: '📸 Image',
          lastActive: firestore.FieldValue.serverTimestamp(),
          unreadCount: firestore.FieldValue.increment(1),
        },
        {merge: true},
      );
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  return {handleCamera, handleSelectImages};
};

export default useChat;
