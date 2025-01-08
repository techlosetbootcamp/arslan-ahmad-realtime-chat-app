import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import Home from './src/screens/Home';
import Contacts from './src/screens/Contacts';
import Profile from './src/screens/Profile';
import {RootStackParamList} from './src/types/navigation';
import firebase from '@react-native-firebase/app';
import Chat from './src/screens/Chat';
import Header from './src/components/Header';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    try {
      if (firebase.apps.length) {
        console.log('Firebase is connected! ✅');
        console.log('Firebase apps:', firebase.apps.length);
        console.log('Current config:', firebase.app().options);
      } else {
        console.log('Firebase is not connected! ❌');
      }
    } catch (error) {
      console.error('Firebase verification failed:', error);
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        //  screenOptions={{headerShown: false}}
        screenOptions={({route}) => ({
          header: () => <Header title={route.name} />,
        })}
        initialRouteName="Home">
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
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
