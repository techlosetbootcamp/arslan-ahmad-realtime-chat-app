import React, {useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {User} from '../../types/firestoreService';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ChatNavigatorStyles} from '../../styles/chatComponents/navigator';
import appNavigate from '../../hooks/useNavigationHook';
import {getRelativeTime} from '../../constants/sideFucntions';
import {COLOR} from '../../constants/colors';
import Images from '../../constants/imgs';
import {deleteChatFromFirebase} from '../../store/slices/chats.slice';
import {showToast} from '../Toast';
import {ChatItem} from '../../types/chat';

interface RenderChatItemProps {
  item: ChatItem;
}

const RenderChatItem: React.FC<RenderChatItemProps> = ({
  item,
}: {
  item: ChatItem;
}) => {
  const {navigation} = appNavigate();
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const userId = user?.uid;

  const participants = item?.participantsDetails?.filter(
    (participant: User) => participant?.uid !== userId,
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
        photoURL: participantImage || null,
        status: participant?.status === 'online' ? 'online' : 'Offline',
      },
    });
  };

  const lastActivityTime = getRelativeTime(item.lastActive);
  const [isSwiped, setIsSwiped] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const renderRightActions = (
    dragAnimatedValue: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const dragX = dragAnimatedValue as Animated.Value;
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const handleDeleteChat = (chatId: string, participants: string[]) => {
      setDeleteClicked(true);
      dispatch(deleteChatFromFirebase(chatId, participants));
      setDeleteClicked(false);
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
                  ? Images.NotificationWhiteIcon
                  : Images.NotificationWhiteIcon
              }
              style={{width: 20, height: 20}}
            />
          </Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[slider.actionButton, slider.deleteButton]}
          onPress={() => handleDeleteChat(item.id, item.participants)}>
          <Animated.Text style={[slider.actionText, {transform: [{scale}]}]}>
            {deleteClicked ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Image
                source={Images.DeleteIcon}
                style={{width: 16, height: 16}}
              />
            )}
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
                  backgroundColor: COLOR.red,
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
    backgroundColor: COLOR.bluish_white,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: COLOR.light_red,
  },
  notificationButton: {
    backgroundColor: COLOR.black,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  swipedChatItem: {
    backgroundColor: COLOR.bluish_white,
  },
});

export default RenderChatItem;
