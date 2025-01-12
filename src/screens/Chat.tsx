import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {addMessage} from '../store/slices/chatSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {Message} from '../store/slices/chatSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat: React.FC<Props> = ({route}) => {
  const {chatId} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const messagesCollection = firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .orderBy('timestamp', 'asc');

    const unsubscribe = messagesCollection.onSnapshot(snapshot => {
      const fetchedMessages: Message[] = snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Message),
      );
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userId = 'user123';
    const newMessage: Message = {
      id: '',
      senderId: userId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    await firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .add(newMessage);

    dispatch(addMessage({chatId, message: {...newMessage, id: 'tempId'}})); // Temporary ID for Redux
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.messageItem}>
            <Text style={styles.senderText}>{item.senderId}:</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageItem: {
    marginBottom: 8,
  },
  senderText: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
