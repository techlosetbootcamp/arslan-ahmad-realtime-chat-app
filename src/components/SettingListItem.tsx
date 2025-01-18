import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../constants/Colors';
import {SettingsItemProps} from '../types/settingsListItem';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  icon,
  subtext,
  link,
}) => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  const route = {screen: link};
  const imgSrc: string = icon;
  return (
    <TouchableOpacity activeOpacity={0.9}
      //   onPress={() => navigation.navigate(link)}
      style={ItemStyles.container}>
      <View style={ItemStyles.notificationCircle}>
        <Image source={icon || require('../assets/icons/contacts.png')} style={ItemStyles.icon} />
      </View>
      <View style={{flexDirection: 'column'}}>
        <Text style={ItemStyles.text}>{title}</Text>
        {subtext && <Text style={ItemStyles.subtext}>{subtext}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const ItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  notificationCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: color.light_blue,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: '#3B82F6',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 12,
    color: '#808080',
  },
});
export default SettingsItem;
