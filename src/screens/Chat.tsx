import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  fetchMessages,
  listenToMessages,
  sendMessage,
} from '../services/firebase';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import useAuth from '../hooks/useAuth';
import ChatHeader from '../components/ChatHeader';
import {ChatProps} from '../types/chatScreenProps';

const ChatScreen: React.FC<ChatProps> = ({route}) => {
  const {chatId, participant} = route.params;
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.chat.messages[chatId] || [],
  );
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
      dispatch({
        type: 'chat/addMessage',
        payload: {
          chatId,
          message: {
            id: `${Date.now()}`,
            senderId: user?.uid,
            text: newMessage,
            contentType: 'text',
            timestamp: new Date().toISOString(),
            status: {sender: 'sent', receiver: 'unread'},
          },
        },
      });
      try {
        if (user?.uid) {
          await sendMessage(participant.uid, user?.uid, newMessage);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setNewMessage('');
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
            isUserMessage={item.senderId === user?.uid}
            timestamp={
              item.timestamp ? new Date(item.timestamp).toLocaleString() : null
            }
          />
        )}
        keyExtractor={item => item.id}
      />
      <ChatInput
        value={newMessage}
        onChangeText={setNewMessage}
        onSend={handleSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
});

export default ChatScreen;
