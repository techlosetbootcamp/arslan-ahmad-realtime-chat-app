import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {User} from '../types/firestoreService';
import {useNavigation} from '@react-navigation/native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ChatNavigatorStyles} from '../styles/chatNavigator';

export const useRenderChatItem = () => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user?.uid;
  const navigation = useNavigation();

  return ({item}: {item: any}) => {
    const participants = item.participantsDetails?.filter(
      (participant: User) => participant.uid !== userId,
    );
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
            }
          })
        }>
        <View style={ChatNavigatorStyles.chatRow}>
          {participantImage ? (
            <Image source={{uri: participantImage}} style={ChatNavigatorStyles.chatImage} />
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
        </View>
      </TouchableOpacity>
    );
  };
};
