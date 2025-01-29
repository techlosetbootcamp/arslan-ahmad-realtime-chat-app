import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color} from '../constants/colors';
import {AuthHeaderSectionProps} from '../types/sectionHeaders';
import SimpleText from './SimpleText';

const AuthHeaderSection: React.FC<AuthHeaderSectionProps> = ({
  title,
  subText,
  styleSubTitle,
  styleTitle,
}) => {
  return (
    <View style={styles.container}>
      <SimpleText
        type="h"
        text={title}
        styles={StyleSheet.flatten([styles.title, styleTitle])}
      />
      <SimpleText
        text={subText}
        color={color.black}
        align="center"
        styles={StyleSheet.flatten([styleSubTitle])}
      />
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
});
