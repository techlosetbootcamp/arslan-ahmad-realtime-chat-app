import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {IconButtonProps} from '../types/IconButton';
import {COLOR} from '../constants/colors';

const IconButton: React.FC<IconButtonProps> = ({
  src,
  size,
  onPress,
  loader = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.ghostIcon}
      onPress={() => onPress()}>
      {loader ? (
        <ActivityIndicator size="small" color={COLOR.white} />
      ) : (
        <Image
          source={src}
          style={!size ? {width: 22.7, height: 23.16} : size}
        />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  ghostIcon: {
    paddingVertical: 5,
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.ghost,
    alignSelf: 'center',
    shadowColor: COLOR.light_grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
