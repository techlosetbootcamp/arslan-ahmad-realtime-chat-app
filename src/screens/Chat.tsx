import React, { useState, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { sendMessage, listenToMessages } from '../services/firestoreService';
import { RootStackParamList } from '../types/navigation';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { contact } = route.params; 
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const unsubscribe = listenToMessages(contact.chatId, (fetchedMessages) => {
      const formattedMessages = fetchedMessages.map((msg) => ({
        _id: msg.id || '',
        text: msg.text,
        createdAt: msg.timestamp?.toDate(),
        user: {
          _id: msg.senderId,
          name: msg.senderId === user.uid ? user.name ?? 'Unknown' : contact.name,
        },
      }));
      setMessages(formattedMessages);
    });

    return () => unsubscribe();
  }, [contact.chatId]);

  const handleSend = async (newMessages: IMessage[]) => {
    const message = newMessages[0];
    await sendMessage(contact.chatId, user.uid!, message.text);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => handleSend(messages)}
      user={{
        _id: user.uid!,
        name: user.name ?? 'Unknown',
      }}
    />
  );
};

export default ChatScreen;
