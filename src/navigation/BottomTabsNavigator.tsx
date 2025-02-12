import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import ContactsScreen from '../screens/contacts/Contacts';
import {RootStackParamList} from '../types/navigation';
import Settings from '../screens/settings/Settings';
import {COLOR} from '../constants/colors';

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.light_grey,
        headerShown: false,
        tabBarIcon: ({focused}) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused
              ? require('../assets/icons/active-message.png')
              : require('../assets/icons/message.png');
          } else if (route.name === 'Contacts') {
            iconSource = focused
              ? require('../assets/icons/active-contacts.png')
              : require('../assets/icons/contacts.png');
          } else if (route.name === 'Settings') {
            iconSource = focused
              ? require('../assets/icons/active-settings.png')
              : require('../assets/icons/setting_icon.png');
          }

          return <Image source={iconSource} style={styles.icon} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen name="Home" component={Home} options={{title: 'Home'}} />
      <Tab.Screen name="Contacts" component={ContactsScreen} options={{title: 'Contacts'}} />
      <Tab.Screen name="Settings" component={Settings} options={{title: 'Settings'}} />
    </Tab.Navigator>
  );
};

const styles = {
  icon: {
    width: 24,
    height: 24,
  },
};

export default BottomTabsNavigator;
