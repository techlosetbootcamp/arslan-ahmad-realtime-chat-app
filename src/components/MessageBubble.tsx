import React from 'react';
import {View, Text, Image} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatScreen';
import {PlaceholderImg} from '../constants/imgs';

const MessageBubble: React.FC<{
  text: string;
  isUserMessage: boolean;
  photoURL?: string;
  participantName?: string;
  timestamp?: string | null;
  nextMessage?: {
    senderId: string;
  } | null;
  previousMessage?: {
    senderId: string;
    timestamp?: string | {toDate: () => Date} | null;
  } | null;
}> = ({
  text,
  isUserMessage,
  timestamp,
  photoURL,
  previousMessage,
  participantName,
  nextMessage,
}) => {
  const time = timestamp?.split(',')[1];
  const validTime = time
    ? time.split(':').slice(0, 2).join(':') + time.slice(-3)
    : '';

  const isFirstMessageInSequence =
    !previousMessage || previousMessage.senderId !== previousMessage.senderId;

  const isLastMessageInSequence =
    !nextMessage || nextMessage.senderId !== previousMessage?.senderId;
  return (
    <View
      style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.participantMessage,
      ]}>
      {!isUserMessage && isFirstMessageInSequence && (
        <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
          <Image
            source={photoURL ? {uri: photoURL} : PlaceholderImg}
            style={{width: 35, height: 35, borderRadius: 17.5}}
          />
          <Text>{participantName}</Text>
        </View>
      )}
      <View
        style={
          !isUserMessage && {marginLeft: isFirstMessageInSequence ? 35 : 0}
        }>
        <Text
          style={
            isUserMessage
              ? styles.userMessageText
              : styles.participantMessageText
          }>
          {text}
        </Text>
        {timestamp && isLastMessageInSequence && (
          <Text style={styles.timestampText}>{validTime}</Text>
        )}
      </View>
    </View>
  );
};

export default MessageBubble;
