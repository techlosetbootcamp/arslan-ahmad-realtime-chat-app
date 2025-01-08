import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import ContactsScreen from '../screens/Contacts';
import Profile from '../screens/Profile';
import { RootStackParamList } from '../types/navigation';


const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Profile"  component={Profile} />
    </Tab.Navigator>
  );
};
