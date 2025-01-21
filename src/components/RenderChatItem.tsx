import React from 'react';
import {useSelector} from 'react-redux';
import {User} from '../types/firestoreService';
import {RootState} from '../store/store';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ChatNavigatorStyles} from '../styles/chatNavigator';
import appNavigate from '../hooks/useNavigation';

interface RenderChatItemProps {
  item: {
    id: string;
    lastMessage: string;
    participantsDetails?: User[];
  };
}

const RenderChatItem: React.FC<RenderChatItemProps> = ({item}: {item: any}) => {
  const {navigation} = appNavigate(); 
  const user = useSelector((state: RootState) => state.user); 
  const userId = user?.uid;

  
  const participants = item.participantsDetails?.filter(
    (participant: User) => participant.uid !== userId,
  );
  console.log('participants ()', item.participantsDetails);

  const participant = participants?.[0];
  const participantImage = participant?.photoURL;
  const participantName = participant?.displayName || 'Unknown';

  return (
    <TouchableOpacity
      style={ChatNavigatorStyles.chatItem}
      onPress={() =>
        navigation.navigate('Chat', {
          chatId: item.id,
          participant: {
            uid: participant?.uid || '',
            displayName: participantName,
            photoURL: participantImage,
            status: participant?.status || 'Offline',
          },
        })
      }>
      <View style={ChatNavigatorStyles.chatRow}>
        {/* Display profile picture or default avatar */}
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
        {/* Chat details */}
        <View style={ChatNavigatorStyles.chatDetails}>
          <Text style={ChatNavigatorStyles.chatText}>{participantName}</Text>
          <Text style={ChatNavigatorStyles.lastMessage}>
            {item.lastMessage || 'No messages yet.'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderChatItem;
