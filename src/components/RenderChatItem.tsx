import React, {useState} from 'react';
import {Chat, User} from '../types/firestoreService';
import {useAppSelector} from '../store/store';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChatNavigatorStyles} from '../styles/chatNavigator';
import appNavigate from '../hooks/useNavigation';
import {getRelativeTime} from '../constants/sideFucntions';
import {Swipeable} from 'react-native-gesture-handler';
import {color} from '../constants/colors';
import {NotificationWhiteIcon} from '../constants/imgs';
import { showToast } from './Toast';

interface RenderChatItemProps {
  item: Chat;
}

interface ChatItem {
  participantsDetails: User[];
  lastActive: number;
  lastMessage: string;
  unreadMessages: number;
  id: string;
}

const RenderChatItem: React.FC<RenderChatItemProps> = ({item}: {item: any}) => {
  const {navigation} = appNavigate();
  const user = useAppSelector(state => state.user);
  const userId = user?.uid;

  const participants = item.participantsDetails?.filter(
    (participant: User) => participant.uid !== userId,
  );

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
  const [isSwiped, setIsSwiped] = useState(false);
  console.log('Chat item =>', item.unreadMessages);

  const renderRightActions = (
    progressAnimatedValue: Animated.AnimatedInterpolation<string | number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const progress =
      progressAnimatedValue as Animated.AnimatedInterpolation<number>;
    const dragX = dragAnimatedValue as Animated.Value;
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const handleDelete = (chatId: string) => {
      console.log('Delete chat with id: ', chatId);
    };

    const handleNotiClick = (chatId: string) => {
      showToast('Notification clicked', 'Chat notification clicked', 'success');
      console.log('Notification clicked for chat with id: ', chatId);
    };

    return (
      <View style={slider.rightActions}>
        <TouchableOpacity
          style={[slider.actionButton, slider.notificationButton]}
          onPress={() => handleNotiClick(item.id)}>
          <Animated.Text style={[slider.actionText, {transform: [{scale}]}]}>
            <Image
              source={
                item.notificationStatus
                  ? NotificationWhiteIcon
                  : NotificationWhiteIcon
              }
              style={{width: 20, height: 20}}
            />
          </Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[slider.actionButton, slider.deleteButton]}
          onPress={() => handleDelete(item.id)}>
          <Animated.Text style={[slider.actionText, {transform: [{scale}]}]}>
            <Image
              source={require('../assets/icons/delete.png')}
              style={{width: 16, height: 16}}
            />
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableWillOpen={() => setIsSwiped(true)}
      onSwipeableClose={() => setIsSwiped(false)}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          ChatNavigatorStyles.chatItem,
          isSwiped && slider.swipedChatItem,
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
          <View
            style={{
              rowGap: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#ccc', fontSize: 12}}>
              {lastActivityTime}
            </Text>
            {item.unreadMessages !== 0 && (
              <Text
                style={{
                  backgroundColor: color.red,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 20,
                  color: '#fff',
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

const slider = StyleSheet.create({
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 10,
    paddingHorizontal: 10,
    backgroundColor: color.bluish_white,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: color.light_red,
  },
  notificationButton: {
    backgroundColor: color.black,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  swipedChatItem: {
    backgroundColor: color.bluish_white,
  },
});

export default RenderChatItem;
