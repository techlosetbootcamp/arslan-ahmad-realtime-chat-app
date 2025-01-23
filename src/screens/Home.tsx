import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {AppDispatch, RootState} from '../store/store';
import {setChats, setLoading} from '../store/slices/chatSlice';
import ContentViewer from '../components/ContentViewer';
import {HomeScreenProps} from '../types/Home';
import {fetchChats} from '../services/firebase';
import {Chat} from '../types/firestoreService';
import RenderChatItem from '../components/RenderChatItem';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const user = useSelector((state: RootState) => state.user);
  const userId = user?.uid;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (!userId) return;

      const fetchedChats = await fetchChats(userId);
      const chatMap = fetchedChats.reduce((acc, chat) => {
        acc[chat.id] = chat;
        return acc;
      }, {} as Record<string, Chat>);

      // Sorting the chats by lastActive on the client side (if not already sorted from Firestore)
      const sortedChats = Object.values(chatMap).sort(
        (a, b) => new Date(b?.lastActive).getTime() - new Date(a?.lastActive).getTime()
      );

      dispatch(setChats(sortedChats));
    };
    fetchData();
    setLoading(false);
  }, [dispatch, userId]);


  return (
    <ContentViewer title="Home">
      <View style={styles.content}>
        <FlatList
          data={Object.values(chats)} 
          keyExtractor={item => item.id}
          renderItem={({item}) => <RenderChatItem item={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No chats yet.</Text>
          }
        />
      </View>
    </ContentViewer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  header: {
    flex: 2,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  Icon: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 50,
    width: 30,
    height: 30,
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

export default HomeScreen;
