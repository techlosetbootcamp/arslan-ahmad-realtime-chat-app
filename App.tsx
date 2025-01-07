import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import Home from './src/screens/Home';
import Contacts from './src/screens/Contacts';
import Profile from './src/screens/Profile';
import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen
          name="Profile"
          initialParams={{
            username: 'Arslan Ahmad',
            userId: 's4f6465',
          }}
          component={Profile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
