import React from 'react';
import {View, Text, Image} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatScreen';
import {PlaceholderImg} from '../constants/imgs';

const MessageBubble: React.FC<{
  text: string;
  isUserMessage: boolean;
  photoURL?: string;
  timestamp?: string | null;
}> = ({text, isUserMessage, timestamp, photoURL}) => {
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
      {!isUserMessage && (
        <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
          <Image
            source={photoURL ? {uri: photoURL} : PlaceholderImg}
            style={{width: 35, height: 35, borderRadius: 17.5}}
          />
          <Text>Participant</Text>
        </View>
      )}
      <View style={!isUserMessage && {marginLeft: 35}}>
        <Text
          style={
            isUserMessage
              ? styles.userMessageText
              : styles.participantMessageText
          }>
          {text}
        </Text>
        {/* {timestamp && <Text style={styles.timestampText}>{validTime}</Text>} */}
      </View>
    </View>
  );
};

export default MessageBubble;
