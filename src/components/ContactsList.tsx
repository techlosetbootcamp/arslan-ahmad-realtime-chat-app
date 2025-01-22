import React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {startChat} from '../store/slices/chatSlice';
import appNavigate from '../hooks/useNavigation';
import appAuth from '../hooks/useAuth';
import {AppDispatch} from '../store/store';
import {ContactsProps} from '../types/contactList';
import {userProfile} from '../types/profile';
import {createNewChat} from '../services/firebase';

const Contacts: React.FC<ContactsProps> = ({sections}) => {
  const {user} = appAuth();
  const dispatch = useDispatch<AppDispatch>();
  const {navigation} = appNavigate();

const handleContactClick = async (
  contactId: string,
  participant: userProfile,
) => {
  if (user?.uid) {
    try {
      const userChats = user.chats;

      const existingChat = userChats?.find(chatId =>
        chatId.includes(contactId),
      );

      if (existingChat) {
        navigation.navigate('Chat', {
          chatId: existingChat,
          participant: {
            uid: participant.uid,
            displayName: participant.displayName,
            photoURL: participant.photoURL || null,
            status: participant.status || 'Offline',
          },
        });
      } else {
        const chatId = await createNewChat([user?.uid, contactId]);
        navigation.navigate('Chat', {
          chatId,
          participant: {
            uid: participant.uid,
            displayName: participant.displayName,
            photoURL: participant.photoURL || null,
            status: participant.status || 'Offline',
          },
        });
      }
    } catch (error) {
      console.error('Error starting or navigating to chat:', error);
    }
  }
};


  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.uid as string}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() =>
            handleContactClick(item.uid as string, item as userProfile)
          }
          style={styles.contactContainer}>
          <Image
            source={
              item.photoURL
                ? {uri: item.photoURL}
                : require('../assets/imgs/profile_placeholder_image.png')
            }
            style={styles.contactImage}
          />
          <View>
            <Text style={styles.contactName}>{item.displayName}</Text>
            {item.status && (
              <Text style={styles.contactStatus}>{item.status}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  contactImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  contactName: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  contactStatus: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '400',
    marginLeft: 10,
  },
});

export default Contacts;
