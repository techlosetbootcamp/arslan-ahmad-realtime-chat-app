import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { RootState } from '../store/store';
import { setChats } from '../store/slices/chatSlice';
// import { HomeScreenProps } from '../types/Home';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.uid) {
      console.warn('User ID is missing. Unable to fetch chats.');
      return;
    }

    const userId = user.uid;
    const chatsCollection = firestore().collection('Chats');

    const unsubscribe = chatsCollection
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTimestamp', 'desc')
      .onSnapshot(
        snapshot => {
          const fetchedChats: Record<string, any> = {};
          snapshot.forEach(doc => {
            fetchedChats[doc.id] = { id: doc.id, ...doc.data() };
          });
          dispatch(setChats(fetchedChats));
        },
        error => {
          console.error('Error fetching chats:', error);
        }
      );

    return () => unsubscribe(); // Unsubscribe on unmount
  }, [dispatch, user?.uid]);

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id })}
    >
      <Text style={styles.chatText}>Chat with {item.members?.join(', ')}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage || 'No messages yet.'}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={Object.values(chats)}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats yet.</Text>}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#888',
  },
});
