import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ActionButtonProps} from '../../types/actionButton';
import {showToast} from '../Toast';
import {COLOR} from '../../constants/colors';

const ButtonContent: React.FC<ActionButtonProps> = ({
  onClick,
  loader,
  children,
  error = false,
}) => {
  const handleClick = () => {
    error
      ? showToast(
          'Error',
          typeof error === 'string' ? error : 'An unknown error occurred',
          'error',
        )
      : onClick();
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleClick}
      disabled={loader}>
      <Text style={styles.button}>
        {!error && loader ? <ActivityIndicator color="#fff" /> : children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.white,
    fontWeight: 600,
  },
});

export default ButtonContent;
