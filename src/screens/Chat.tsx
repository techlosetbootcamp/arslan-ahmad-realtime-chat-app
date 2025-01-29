import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {Timestamp} from 'firebase/firestore';
import {useAppDispatch, useAppSelector} from '../store/store';
import {
  fetchMessages,
  listenToMessages,
  sendMessage,
} from '../services/messages';
import ChatInput from '../components/ChatInput';
import useAuth from '../hooks/useAuth';
import ChatHeader from '../components/ChatHeader';
import {ChatProps} from '../types/chatScreenProps';
import MessageBubble from '../components/MessageBubble';
import {addMessage} from '../store/slices/chats';
import {Message} from '../types/firestoreService';

const ChatScreen: React.FC<ChatProps> = ({route}) => {
  const {chatId, participant} = route.params;
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages[chatId] || []);
  const [newMessage, setNewMessage] = useState('');
  const {user} = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await fetchMessages(chatId);
        dispatch({type: 'chat/setMessages', payload: {chatId, messages}});
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    loadMessages();
  }, [chatId, dispatch]);

  useEffect(() => {
    const unsubscribe = listenToMessages(chatId, newMessages => {
      dispatch({
        type: 'chat/setMessages',
        payload: {chatId, messages: newMessages},
      });
    });
    return () => unsubscribe();
  }, [chatId, dispatch]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      const message = {
        id: `${Date.now()}`,
        senderId: user?.uid || '',
        text: newMessage,
        contentType: 'text',
        timestamp: Timestamp.fromDate(new Date()),
        status: {sender: 'sent', receiver: 'unread'},
      };

      dispatch(addMessage({chatId, message}));
      setNewMessage('');
      try {
        if (user?.uid) {
          await sendMessage(participant.uid, user?.uid, message as Message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        displayName={participant.displayName}
        profileImage={participant.photoURL}
        status={participant.status}
      />
      <FlatList
        data={messages}
        style={{gap: 10, padding: 10}}
        renderItem={({item}) => (
          <MessageBubble
            text={item.text}
            photoURL={participant.photoURL || ''}
            isUserMessage={item.senderId === user?.uid}
            timestamp={
              item.timestamp
                ? typeof item.timestamp === 'string'
                  ? new Date(item.timestamp).toLocaleString()
                  : new Date(item.timestamp.toDate()).toLocaleString()
                : null
            }
          />
        )}
        keyExtractor={item => item.id}
      />
      <ChatInput
        value={newMessage}
        onChangeText={setNewMessage}
        onSend={handleSend}
        recvId={participant.uid}
        senderId={user?.uid || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
});

export default ChatScreen;
