import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {fetchContacts} from '../services/firestoreService';
import {User} from '../types/firestoreService';
import {ContactsProps} from '../types/contacts';
import ContentViewer from '../components/ContentViewer';

const ContactsScreen: React.FC<ContactsProps> = ({navigation}) => {
  const [contacts, setContacts] = useState<User[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      const fetchedContacts = await fetchContacts();
      setContacts(fetchedContacts);
    };
    loadContacts();
  }, []);

  return (
    <ContentViewer title="Contacts">
      <View style={{flex: 1, paddingTop: 20}}>
        <Text>Hello from Contact page.</Text>
      </View>
    </ContentViewer>
  );
};

export default ContactsScreen;
