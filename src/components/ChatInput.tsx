import React from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatComponents/screen';
import useChatInput from '../hooks/useChatInput';
import Images from '../constants/imgs';

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
        <Image source={Images.PaperClipIcon} style={styles.cameraIcon} />
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
          <View
            style={{
              width: 27,
              height: 27,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={Images.SendIcon} style={{width: 25, height: 25}} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleCamera(chatId, senderId)}
        style={styles.cameraButton}>
        <View style={styles.cameraIcon}>
          <Image source={Images.CameraIcon} style={styles.cameraIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
