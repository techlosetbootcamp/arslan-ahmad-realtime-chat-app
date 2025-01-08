import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {HomeScreenProps} from '../types/Home';

const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 15,
        }}>
        Home
      </Text>
      <View style={{marginVertical: 15}}>
        <Button
          title="Go to Contacts"
          onPress={() => navigation.navigate('Contacts', {})}
        />
      </View>
      <Button
        title="Go to Chats"
        onPress={() => navigation.navigate('Chat', {})}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
