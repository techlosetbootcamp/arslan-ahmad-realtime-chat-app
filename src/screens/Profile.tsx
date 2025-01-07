import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ProfileProps} from '../types/Profile';

const Profile: React.FC<ProfileProps> = ({navigation, route}) => {
  const {username, userId} = route.params;
  console.log('route', route);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 15,
        }}>
        Profile
      </Text>

      <Text>Username: {username}</Text>
      <Text>UserId: {userId}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
