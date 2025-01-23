import React from 'react';
import {useSelector} from 'react-redux';
import {Chat, User} from '../types/firestoreService';
import {RootState} from '../store/store';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ChatNavigatorStyles} from '../styles/chatNavigator';
import appNavigate from '../hooks/useNavigation';
import {getRelativeTime} from '../constants/sideFucntions';

interface RenderChatItemProps {
  item: Chat;
}

const RenderChatItem: React.FC<RenderChatItemProps> = ({item}: {item: any}) => {
  const {navigation} = appNavigate();
  const user = useSelector((state: RootState) => state.user);
  const userId = user?.uid;

  const participants = item.participantsDetails?.filter(
    (participant: User) => participant.uid !== userId,
  );
  console.log('Item (RenderChatItem.tsx)', item);

  const participant = participants?.[0];
  const participantImage = participant?.photoURL;
  const participantName = participant?.displayName || 'Unknown';
  const handleChatPress = () => {
    navigation.navigate('Chat', {
      chatId: item.id,
      participant: {
        uid: participant?.uid || '',
        displayName: participantName,
        photoURL: participantImage,
        status: participant?.status || 'Offline',
      },
    });
  };

  const lastActivityTime = getRelativeTime(item.lastActive);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={ChatNavigatorStyles.chatItem}
      onPress={handleChatPress}>
      <View style={ChatNavigatorStyles.chatRow}>
        {participantImage ? (
          <Image
            source={{uri: participantImage}}
            style={ChatNavigatorStyles.chatImage}
          />
        ) : (
          <View style={ChatNavigatorStyles.defaultImage}>
            <Text style={ChatNavigatorStyles.defaultImageText}>
              {participantName[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={ChatNavigatorStyles.chatDetails}>
          <Text style={ChatNavigatorStyles.chatText}>{participantName}</Text>
          <Text style={ChatNavigatorStyles.lastMessage}>
            {item.lastMessage || 'No messages yet.'}
          </Text>
        </View>
        <View style={{height: '100%', justifyContent: 'space-between'}}>
          <Text style={{color: '#ccc', fontSize: 12}}>{lastActivityTime}</Text>
          {item.unreadMessages && <Text>{item.unreadMessages}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderChatItem;
