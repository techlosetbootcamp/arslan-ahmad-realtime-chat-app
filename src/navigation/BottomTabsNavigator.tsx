import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import ContactsScreen from '../screens/Contacts';
import {RootStackParamList} from '../types/navigation';
import Settings from '../screens/Settings';
import {color} from '../constants/Colors';
import {Image} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile';
import Search from '../screens/Search';

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabsNavigator = () => {
  let textColor = color.light_grey;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
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
          color: textColor,
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};


const Stack = createNativeStackNavigator<RootStackParamList>();
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabsNavigator} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
};

const styles = {
  icon: {
    width: 24,
    height: 24,
  },
};

export default AppStack;