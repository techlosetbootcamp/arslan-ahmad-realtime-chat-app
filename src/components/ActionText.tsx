import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TextStyle} from 'react-native';

type ActionTextProps = {
  onPress: () => void;
  styles: TextStyle;
  children: React.ReactNode | string;
};

const ActionText: React.FC<ActionTextProps> = ({onPress, children, styles}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Text style={[styles]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ActionText;

