import { View, Text } from 'react-native';
import React from 'react';
import { RulerTextProps } from '../types/rulerText';
import { COLOR } from '../constants/colors';

const RulerText: React.FC<RulerTextProps> = ({
  textColor = COLOR.black,
  lineColor = COLOR.dark_gray,
}) => {
  return (
    <View
      style={styles.row}
    >
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
      <View>
        <Text style={{ ...styles.text, color: textColor }}>OR</Text>
      </View>
      <View style={{ ...styles.line, backgroundColor: lineColor }} />
    </View>
  );
};

const styles = {
  line: { flex: 1, height: 1, backgroundColor: COLOR.gray },
  row: { flexDirection: 'row' as 'row', alignItems: 'center' as 'center', marginVertical: 20 },
  text: {
    width: 50,
    textAlign: 'center' as 'center',
    color: 'white',
    fontWeight: 900 as 900,
  },
};

export default RulerText;
