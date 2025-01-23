import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color} from '../constants/colors';
import { AuthHeaderSectionProps } from '../types/sectionHeaders';

const AuthHeaderSection: React.FC<AuthHeaderSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{children}</Text>
    </View>
  );
};

export default AuthHeaderSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  title: {
    color: color.blue,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: color.black,
    fontSize: 16,
    fontWeight: '300',
    width: 293,
    textAlign: 'center',
  },
});
