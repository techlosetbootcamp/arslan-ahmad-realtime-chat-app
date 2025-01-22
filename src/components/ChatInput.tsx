import React from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {chatScreenStyles as styles} from '../styles/chatScreen';

const ChatInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}> = ({value, onChangeText, onSend}) => {
  const handleCamera = () => {
    console.log('Camera button pressed');
  };

  const handleSelectImages = () => {
    console.log('Select images button pressed');
  };
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        onPress={handleSelectImages}
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
      <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
        <Image
          source={require('../assets/icons/camera.png')}
          style={styles.cameraIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
