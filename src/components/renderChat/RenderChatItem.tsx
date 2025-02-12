import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {User} from '../../types/firestoreService';
import {useAppSelector} from '../../store/store';
import {ChatNavigatorStyles} from '../../styles/chatComponents/navigator';
import appNavigate from '../../hooks/useNavigationHook';
import {getRelativeTime} from '../../constants/sideFucntions';
import {COLOR} from '../../constants/colors';
import ChatSwipeActions from './ChatSwipeActions';

import {ChatItem} from '../../types/chat';

interface RenderChatItemProps {
  item: ChatItem;
}

const RenderChatItem: React.FC<RenderChatItemProps> = ({item}) => {
  const {navigation} = appNavigate();
  const lastActivityTime = getRelativeTime(item?.lastActive);
  const [isSwiped, setIsSwiped] = useState(false);
  const user = useAppSelector(state => state.user);
  const userId = user?.uid;

  const participants = item?.participantsDetails?.filter(
    (participant: User) => participant?.uid !== userId,
  );
  const participant = participants?.[0];
  const participantImage = participant?.photoURL;
  const participantName = participant?.displayName || 'Unknown';

  const handleChatPress = () => {
    navigation.navigate('Chat', {
      chatId: item?.id,
      participant: {
        uid: participant?.uid || '',
        displayName: participantName,
        photoURL: participantImage || null,
        status: participant?.status ? participant?.status : '',
      },
    });
  };

  return (
    <Swipeable
      renderRightActions={dragAnimatedValue => (
        <ChatSwipeActions item={item} dragAnimatedValue={dragAnimatedValue} />
      )}
      overshootRight={false}
      onSwipeableWillOpen={() => setIsSwiped(true)}
      onSwipeableClose={() => setIsSwiped(false)}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          ChatNavigatorStyles.chatItem,
          isSwiped && {backgroundColor: COLOR.bluish_white},
        ]}
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
          <View style={{rowGap: 10, alignItems: 'center'}}>
            {item?.lastActive && (
              <Text style={{color: '#ccc', fontSize: 12}}>
                {lastActivityTime}
              </Text>
            )}
            {item.unreadMessages !== 0 && (
              <Text
                style={{
                  backgroundColor: COLOR.red,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 20,
                  color: COLOR.white,
                }}>
                {item.unreadMessages}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default RenderChatItem;