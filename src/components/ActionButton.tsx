import {View, Text, TouchableOpacity} from 'react-native';
import React, {ReactChildren} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ActionButtonProps } from '../types/actionButton';

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  loader,
  color,
  onLoadText,
  children,
}) => {
  return !color ? (
    <LinearGradient
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={{
        padding: 14,
        borderRadius: 16,
      }}
      colors={['#010102', '#192f6a', '#3b5998']}>
      <ButtonContent
        onClick={onClick}
        loader={loader}
        onLoadText={onLoadText}
        children={children}
      />
    </LinearGradient>
  ) : (
    <View
      style={{
        padding: 14,
        borderRadius: 16,
        backgroundColor: color,
      }}>
      <ButtonContent
        onClick={onClick}
        loader={loader}
        onLoadText={onLoadText}
        children={children}
      />
    </View>
  );
};

const ButtonContent: React.FC<ActionButtonProps> = ({
  onClick,
  loader,
  onLoadText,
  children,
}) => {
  return (
    <TouchableOpacity onPress={onClick} disabled={loader}>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          color: 'white',
          fontWeight: 600,
        }}>
        {loader ? onLoadText : children}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
