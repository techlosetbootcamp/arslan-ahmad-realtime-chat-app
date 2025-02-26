import {StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ActionButtonProps} from '../../types/actionButton';
import ButtonContent from './ButtonContent';
import {COLOR} from '../../constants/colors';

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  loader,
  color,
  onLoadText,
  children,
  error,
}) => {
  return !color ? (
    <LinearGradient
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={styles.linearGradient}
      colors={COLOR.gradient_colors}>
      <ButtonContent
        onClick={onClick}
        loader={loader}
        onLoadText={onLoadText}
        children={children}
        error={error}
      />
    </LinearGradient>
  ) : (
    <View style={[styles.button, {backgroundColor: color}]}>
      <ButtonContent
        onClick={onClick}
        loader={loader}
        onLoadText={onLoadText}
        children={children}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    padding: 14,
    borderRadius: 16,
  },
  button: {
    padding: 14,
    borderRadius: 16,
  },
});

export default ActionButton;
