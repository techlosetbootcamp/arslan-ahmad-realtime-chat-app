import React from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatScreen';
import useChatInput from '../hooks/useChatInput';

const ChatInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  recvId: string;
  senderId: string;
}> = ({value, onChangeText, onSend, recvId: chatId, senderId}) => {
  const {handleSelectImages, handleCamera} = useChatInput();

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        onPress={() => handleSelectImages(chatId, senderId)}
        style={styles.attachmentButton}>
        <Image
          source={require('../assets/icons/clip.png')}
          style={styles.cameraIcon}
        />
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#888"
          numberOfLines={2}
          placeholder="Write your message"
          onKeyPress={() => console.log('Typed...')}
        />
        <TouchableOpacity onPress={onSend} style={styles.attachmentButton}>
          <Image
            source={require('../assets/icons/send.png')}
            style={{width: 27, height: 27}}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleCamera(chatId, senderId)}
        style={styles.cameraButton}>
        <Image
          source={require('../assets/icons/camera.png')}
          style={styles.cameraIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
