import {ActivityIndicator, Dimensions, View} from 'react-native';
import React from 'react';
import {color as ThemeColor} from '../constants/colors';

type LoaderProps = {
  size?: 'small' | 'large';
  color?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = ThemeColor.blue,
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
        flex: 1,
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(61, 61, 61, 0.1)',
      }}>
      <View
        style={{
          backgroundColor: 'rgba(253, 251, 251, 0.5)',
          zIndex: 10,
          height: 80,
          width: 80,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </View>
  );
};

export default Loader;
