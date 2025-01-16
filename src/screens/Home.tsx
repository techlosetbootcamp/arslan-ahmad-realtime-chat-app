import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {RootState} from '../store/store';
import {setChats} from '../store/slices/chatSlice';
import {RootStackParamList} from '../types/navigation';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import Loader from '../components/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContentViewer from '../components/ContentViewer';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const user = useSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   if (!user?.uid) {
  //     console.warn('User ID is missing. Unable to fetch chats.');
  //     return;
  //   }

  //   const userId = user.uid;
  //   const chatsCollection = firestore().collection('Chats');

  //   const unsubscribe = chatsCollection
  //     .where('Users', 'array-contains', userId)
  //     .orderBy('lastMessageTimestamp', 'desc')
  //     .onSnapshot(
  //       snapshot => {
  //         const fetchedChats: Record<string, any> = {};
  //         snapshot.forEach(doc => {
  //           fetchedChats[doc.id] = { id: doc.id, ...doc.data() };
  //         });
  //         dispatch(setChats(fetchedChats));
  //       },
  //       error => {
  //         console.error('Error fetching chats:', error);
  //       }
  //     );

  //   return () => unsubscribe(); // Unsubscribe on unmount
  // }, [dispatch, user?.uid]);

  const renderChatItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {chatId: item.id})}>
      <Text style={styles.chatText}>Chat with {item.members?.join(', ')}</Text>
      <Text style={styles.lastMessage}>
        {item.lastMessage || 'No messages yet.'}
      </Text>
    </TouchableOpacity>
  );
  return (
    <ContentViewer title="Home">
      <View style={styles.content}>
        <FlatList
          data={Object.values(chats)}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No chats yet.</Text>
          }
        />
      </View>
    </ContentViewer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
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
