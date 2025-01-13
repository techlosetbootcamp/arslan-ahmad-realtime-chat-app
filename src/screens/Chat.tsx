import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const Chat: React.FC<Props> = ({ route, navigation }) => {
  const { chatId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen</Text>
      <Text style={styles.text}>Chat ID: {chatId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Chat;
