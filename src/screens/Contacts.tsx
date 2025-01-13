import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {fetchContacts} from '../services/firestoreService';
import {HomeScreenProps} from '../types/Home';
import {User} from '../types/firestoreService';
import { ContactsProps } from '../types/Contacts';

const ContactsScreen: React.FC<ContactsProps> = ({navigation}) => {
  const [contacts, setContacts] = useState<User[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      const fetchedContacts = await fetchContacts();
      setContacts(fetchedContacts);
    };
    loadContacts();
  }, []);

  const handleChat = (contact: User) => {
    navigation.navigate('Chat', {contact});
  };


  return (
    <View style={{flex: 1, paddingTop: 20}}>
      <Text>Hello from Contact page.</Text>
      <FlatList
        data={contacts}
        style={{marginTop: 20, backgroundColor: 'tomato', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginVertical: 10}}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleChat(item)}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
              {/* <Image
                source={{uri: item.photoURL}}
                style={{width: 50, height: 50, borderRadius: 25}}
              /> */}
              <View style={{marginLeft: 10}}>
                <Text>{item.displayName}</Text>
                <Text>{item.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ContactsScreen;
