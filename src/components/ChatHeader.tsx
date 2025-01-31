import {Image, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ChatHeaderProps} from '../types/chatHeader';
import Images from '../constants/imgs';
import {ChatHeaderStyles} from '../styles/chatComponents/header';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileImage,
  displayName,
  status,
}) => {
  const navigation = useNavigation();
  return (
    <View style={ChatHeaderStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={Images.BlackBackIcon} style={ChatHeaderStyles.backIcon} />
      </TouchableOpacity>

      <View style={ChatHeaderStyles.userInfoContainer}>
        <View>
          <Image
            source={profileImage ? {uri: profileImage} : Images.PlaceholderImg}
            style={ChatHeaderStyles.profileImage}
          />
          <View style={ChatHeaderStyles.onlineStatus}></View>
        </View>
        <View>
          <Text style={ChatHeaderStyles.displayName}>{displayName}</Text>
          <Text style={ChatHeaderStyles.status}>{status || 'Offline'}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;
