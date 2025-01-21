import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {RootState} from '../store/store';
import {
  fetchMessages,
  listenToMessages,
  sendMessage,
} from '../services/firebase';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';

const ChatScreen: React.FC<{route: any}> = ({route}) => {
  const {chatId, participant} = route?.params;
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
        console.error('Error fetching messages: (Chat.tsx)', error);
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

  // ---------- ChatScreen.tsx ----------
  const handleSendAction = async () => {
    if (newMessage.trim()) {
      handleSend();
    } else {
      if (user?.uid) {
        sendMessage(chatId, user?.uid, 'File attached');
      }
    }
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      const message = {
        id: `${Date.now()}`,
        senderId: user?.uid,
        text: newMessage,
        contentType: 'text',
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: {sender: 'sent', receiver: 'unread'},
      };

      dispatch({type: 'chat/addMessage', payload: {chatId, message}});
      try {
        if (user?.uid) {
          await sendMessage(chatId, user?.uid, newMessage);
        }
      } catch (error) {
        console.error('Error sending message:(Chat.tsx)', error);
      }
      console.log('Sending message (sendMessage)');
      setNewMessage('');
    }
  };

  const renderMessage = ({item}: any) => {
    const isUserMessage = item.senderId === user?.uid;
    const participant =
      item.senderId === user?.uid
        ? item.participantsDetails.find((p: any) => p.uid === item.senderId)
        : item.participantsDetails.find((p: any) => p.uid !== user?.uid);

    const messageTimestamp = item.timestamp
      ? new Date(item.timestamp).toLocaleString()
      : null;
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.participantMessage,
        ]}>
        <Text style={{fontSize: 16, color: 'red'}}>
          {participant.displayName}
        </Text>
        <Text
          style={
            isUserMessage
              ? styles.userMessageText
              : styles.participantMessageText
          }>
          {item.text}
        </Text>
        {messageTimestamp && (
          <Text style={styles.timestampText}>{messageTimestamp}</Text>
        )}
      </View>
    );
  };

  const handleCamera = () => {
    console.log('Camera button pressed');
  };

  const handleSelectImages = () => {
    console.log('Select images button pressed');
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        profileImage={participant.photoURL}
        displayName={participant.displayName}
        status={participant.status}
      />
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handleSelectImages}
          style={styles.attachmentButton}>
          <Image
            source={require('../assets/icons/clip.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholderTextColor="#888"
            placeholder="Write your message"
            onKeyPress={() => console.log('Typed...')}
          />
          <TouchableOpacity
            onPress={handleSendAction}
            style={styles.attachmentButton}>
            <Image
              source={require('../assets/icons/send.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
          <Image
            source={require('../assets/icons/camera.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  messageContainer: {padding: 10},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  attachmentButton: {
    padding: 5,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(231, 231, 231)',
  },
  input: {
    fontSize: 16,
    color: 'black',
    width: '80%',
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  cameraButton: {
    padding: 10,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    backgroundColor: '#DCF8C6',
  },
  participantMessage: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#E4E6EB',
  },
  userMessageText: {
    color: 'black',
    fontSize: 16,
  },
  participantMessageText: {
    color: 'black',
    fontSize: 16,
  },
  timestampText: {
    color: '#333',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
});
