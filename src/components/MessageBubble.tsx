import React from 'react';
import {View, Text} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatScreen';

const MessageBubble: React.FC<{
  text: string;
  isUserMessage: boolean;
  timestamp?: string | null;
}> = ({text, isUserMessage, timestamp}) => {
  const time = timestamp?.split(',')[1];
  const validTime = time
    ? time.split(':').slice(0, 2).join(':') + time.slice(-3)
    : '';
  return (
    <View
      style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.participantMessage,
      ]}>
      <Text
        style={
          isUserMessage ? styles.userMessageText : styles.participantMessageText
        }>
        {text}
      </Text>
      {timestamp && <Text style={styles.timestampText}>{validTime}</Text>}
    </View>
  );
};

export default MessageBubble;
