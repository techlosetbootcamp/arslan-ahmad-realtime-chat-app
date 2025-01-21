import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import { ChatHeaderProps } from '../types/chatHeader';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileImage,
  displayName,
  status,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/icons/back_black.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.userInfoContainer}>
        <Image
          source={
            profileImage
              ? {uri: profileImage}
              : require('../assets/imgs/profile_placeholder_image.png')
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.status}>{status || 'Offline'}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    elevation: 2,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: 'gray',
  },
});
