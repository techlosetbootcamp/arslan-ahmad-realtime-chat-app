import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../constants/colors';
import {SettingsItemProps} from '../types/settingsListItem';
import {RootStackParamList} from '../types/navigation';
import appNavigate from '../hooks/useNavigation';

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  icon,
  subtext,
  link,
}) => {
  const {navigation} = appNavigate();

    const handlePress = () => {
        if (link !== null) {
          navigation.navigate(link);
        }
      };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}
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
