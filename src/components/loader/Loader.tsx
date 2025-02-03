import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import {color, color as ThemeColor} from '../../constants/colors';

const Loader: React.FC = ({
  size = 'large',
  color = ThemeColor.blue,
}: {
  size?: 'small' | 'large';
  color?: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
    flex: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.light_grey,
  },
  loaderContainer: {
    backgroundColor: color.white,
    zIndex: 10,
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
