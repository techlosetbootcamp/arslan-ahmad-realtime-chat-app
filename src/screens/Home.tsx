import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useAppSelector} from '../store/store';
import ContentViewer from '../components/ContentViewer';
import {HomeScreenProps} from '../types/home';
import {Chat} from '../types/firestoreService';
import RenderChatItem from '../components/renderChat/RenderChatItem';
import HomeStyles from '../styles/home';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {chats} = useAppSelector(store => store.chat);
  const {chats:userChats} = useAppSelector(store => store.user);
  return (
    <ContentViewer title="Home">
      <View style={HomeStyles.content}>
        {/* {isChatLoading  ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : ( */}
          <FlatList
            data={Object.values(chats) as Chat[]}
            keyExtractor={item => item?.id}
            renderItem={({item}) => <RenderChatItem item={item} />}
            ListEmptyComponent={
              <Text style={HomeStyles.emptyText}>No chats yet.</Text>
            }
          />
        {/* )} */}
      </View>
    </ContentViewer>
  );
};

export default HomeScreen;
