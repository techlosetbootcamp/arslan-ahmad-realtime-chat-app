import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { ContactsProps } from '../types/Contacts';

const Contacts:React.FC<ContactsProps> = ({navigation}: any) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 15,
        }}>
        Contacts
      </Text>
      <Button
        title="Go to Profile"
        onPress={() =>
          navigation.navigate('Profile')
        }
      />
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({});
