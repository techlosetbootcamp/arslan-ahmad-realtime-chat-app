import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../store/store';
import ContentViewer from '../components/ContentViewer';
import {HomeScreenProps} from '../types/home';
import {Chat} from '../types/firestoreService';
import RenderChatItem from '../components/RenderChatItem';
import Loader from '../components/Loader';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {chats, isLoading} = useAppSelector(store => store.chat);
  return (
    <ContentViewer title="Home">
      <View style={styles.content}>
        {isLoading ? (
          <View>
            <Loader />
          </View>
        ) : (
          <FlatList
            data={Object.values(chats) as Chat[]}
            keyExtractor={item => item?.id}
            renderItem={({item}) => <RenderChatItem item={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No chats yet.</Text>
            }
          />
        )}
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
