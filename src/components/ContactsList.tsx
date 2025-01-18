import React from 'react';
import {View, Text, SectionList, StyleSheet, Image} from 'react-native';
import {User} from '../types/firestoreService';

interface ContactsProps {
  sections: {title: string; data: User[]}[];
}

const Contacts: React.FC<ContactsProps> = ({sections}) => {
  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.uid}
      renderItem={({item}) => (
        <View style={styles.contactContainer}>
          <Image
            source={
                item.photoURL
                  ? { uri: item.photoURL } 
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
        </View>
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
