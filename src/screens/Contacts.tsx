import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const Contacts = ({navigation}: any) => {
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
          navigation.navigate('Profile', {
            username: 'Arslan Ahmad',
            userId: 's4f6465',
          })
        }
      />
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({});
