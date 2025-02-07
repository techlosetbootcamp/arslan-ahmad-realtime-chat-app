import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import useHome from './useHome';
import {ChatItem} from '../../types/chat';
import HomeStyles from '../../styles/home';
import {HomeScreenProps} from '../../types/home';
import {Chat} from '../../types/firestoreService';
import ContentViewer from '../../components/ContentViewer';
import RenderChatItem from '../../components/renderChat/RenderChatItem';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {chats, chatLoader} = useHome();
  console.log('chats', chats);
  return (
    <ContentViewer title="Home">
      <View style={HomeStyles.content}>
        {chatLoader ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={Object.values(chats) as Chat[]}
            keyExtractor={item => item?.id}
            renderItem={({item}) => (
              <RenderChatItem item={item as unknown as ChatItem} />
            )}
            ListEmptyComponent={
              <Text style={HomeStyles.emptyText}>No chats yet.</Text>
            }
          />
        )}
      </View>
    </ContentViewer>
  );
};

export default HomeScreen;
