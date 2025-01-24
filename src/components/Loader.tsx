import {ActivityIndicator} from 'react-native';
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
  return <ActivityIndicator size={size} color={color} />;
};

export default Loader;
