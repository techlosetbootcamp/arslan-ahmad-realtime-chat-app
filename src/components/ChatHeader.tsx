import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ChatHeaderProps} from '../types/chatHeader';
import {color} from '../constants/colors';
import {BlackBackIcon, PlaceholderImg} from '../constants/imgs';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileImage,
  displayName,
  status,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={BlackBackIcon} style={styles.backIcon} />
      </TouchableOpacity>
 
       <View style={styles.userInfoContainer}>
         <View>
           <Image
             source={profileImage ? {uri: profileImage} : PlaceholderImg}
             style={styles.profileImage}
           />
           <View style={styles.onlineStatus}></View>
         </View>
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
  imgContainer: {
    position: 'relative',
  },
  onlineStatus: {
    width: 12,
    height: 12,
    borderRadius: 7.5,
    backgroundColor: color.green,
    position: 'absolute',
    right: 10,
    bottom: -2,
    borderWidth: 2,
    borderColor: 'white',
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
